export const runtime = 'nodejs'

import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { normalizeBlogSection } from '@/lib/blog-schema'
import { getPublishedBlogPosts } from '@/lib/blog'
import { getContent, saveContent, type SiteContent } from '@/lib/content'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import { createRequestId, getRequestMeta, logError, logInfo, logWarn, summarizePayload } from '@/lib/logger'

function prepareBlogSection(current: SiteContent['blog'], next: unknown) {
  const normalizedCurrent = normalizeBlogSection(current)
  const normalizedNext = normalizeBlogSection(next)
  const currentById = new Map(normalizedCurrent.posts.map((post) => [post.id, post]))
  const now = new Date().toISOString()

  return {
    ...normalizedNext,
    posts: normalizedNext.posts.map((post) => {
      const previous = currentById.get(post.id)

      return {
        ...post,
        tags: [...new Set(post.tags)],
        serviceIds: [...new Set(post.serviceIds)],
        relatedPageKeys: [...new Set(post.relatedPageKeys)],
        relatedPostIds: [...new Set(post.relatedPostIds)].filter(
          (relatedId) => relatedId !== post.id
        ),
        publishedAt:
          post.status === 'published'
            ? post.publishedAt || previous?.publishedAt || now
            : post.publishedAt || previous?.publishedAt,
        updatedAt: now,
      }
    }),
  }
}

function unauthorized() {
  return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
}

function revalidatePublicContent(content: SiteContent) {
  const paths = [
    '/',
    '/about',
    '/services',
    '/how-it-works',
    '/pricing',
    '/faq',
    '/contact',
    '/blog',
    '/privacy',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
  ]

  revalidatePath('/', 'layout')

  for (const path of paths) {
    revalidatePath(path)
  }

  for (const post of getPublishedBlogPosts(content)) {
    revalidatePath(`/blog/${post.slug}`)
  }
}

export async function GET(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)
  const startedAt = Date.now()

  logInfo('admin.content.get.request', { requestId, ...requestMeta })

  if (!(await isAuthenticatedFromRequest(request))) {
    logWarn('admin.content.get.unauthorized', { requestId, ...requestMeta })
    return unauthorized()
  }
  try {
    const content = getContent()
    logInfo('admin.content.get.success', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      version: content._meta.version,
      lastUpdated: content._meta.lastUpdated,
    })
    return NextResponse.json(content)
  } catch (error) {
    logError('admin.content.get.error', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      error,
    })
    return NextResponse.json({ error: 'Не удалось загрузить данные' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)
  const startedAt = Date.now()

  logInfo('admin.content.patch.request', { requestId, ...requestMeta })

  if (!(await isAuthenticatedFromRequest(request))) {
    logWarn('admin.content.patch.unauthorized', { requestId, ...requestMeta })
    return unauthorized()
  }
  try {
    const body = await request.json() as { section: keyof SiteContent; data: unknown }
    const { section, data } = body

    if (!section || data === undefined) {
      logWarn('admin.content.patch.validation_failed', {
        requestId,
        ...requestMeta,
        reason: 'missing_section_or_data',
      })
      return NextResponse.json({ error: 'Не указан раздел или данные' }, { status: 400 })
    }

    if (section === '_meta') {
      logWarn('admin.content.patch.forbidden_section', {
        requestId,
        ...requestMeta,
        section,
      })
      return NextResponse.json({ error: 'Этот раздел нельзя редактировать' }, { status: 403 })
    }

    const current = getContent()
    const preparedData =
      section === 'blog' ? prepareBlogSection(current.blog, data) : data
    const updated = { ...current, [section]: preparedData } as SiteContent
    saveContent(updated)
    revalidatePublicContent(updated)
    logInfo('admin.content.patch.success', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      section,
      payload: summarizePayload(data),
      lastUpdated: updated._meta.lastUpdated,
    })

    return NextResponse.json({ success: true, lastUpdated: updated._meta.lastUpdated })
  } catch (err) {
    logError('admin.content.patch.error', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      error: err,
    })
    console.error('Ошибка сохранения:', err)
    return NextResponse.json({ error: 'Не удалось сохранить данные' }, { status: 500 })
  }
}
