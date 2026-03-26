export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import {
  runB17Check,
  runB17ImportByUrl,
  runB17ImportNew,
  runB17ReimportPost,
} from '@/lib/blog-import/service'
import { normalizeBlogSection } from '@/lib/blog-schema'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import { getContent, saveContent } from '@/lib/content'
import { revalidatePublicContent } from '@/lib/content-revalidation'
import { createRequestId, getRequestMeta, logError, logInfo, logWarn, summarizePayload } from '@/lib/logger'

type BlogImportAction =
  | {
      action: 'check'
      maxPages?: number
    }
  | {
      action: 'import-new'
      maxPages?: number
    }
  | {
      action: 'import-url'
      url: string
    }
  | {
      action: 'reimport'
      postId: string
    }

function unauthorized() {
  return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
}

function parseMaxPages(value: unknown) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return undefined
  }

  return Math.max(1, Math.min(50, Math.trunc(parsed)))
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)
  const startedAt = Date.now()

  logInfo('admin.blog_import.request', { requestId, ...requestMeta })

  if (!(await isAuthenticatedFromRequest(request))) {
    logWarn('admin.blog_import.unauthorized', { requestId, ...requestMeta })
    return unauthorized()
  }

  try {
    const body = (await request.json()) as BlogImportAction
    const content = getContent()
    const action = body?.action
    const maxPages = parseMaxPages('maxPages' in body ? body.maxPages : undefined)
    let result

    if (action === 'check') {
      result = await runB17Check(content, { maxPages })
      saveContent(content)
    } else if (action === 'import-new') {
      result = await runB17ImportNew(content, { maxPages })
      saveContent(content)
      revalidatePublicContent(content)
    } else if (action === 'import-url') {
      if (!body.url?.trim()) {
        return NextResponse.json({ error: 'Укажите URL публикации B17 для импорта.' }, { status: 400 })
      }

      result = await runB17ImportByUrl(content, body.url.trim())
      saveContent(content)
      revalidatePublicContent(content)
    } else if (action === 'reimport') {
      if (!body.postId?.trim()) {
        return NextResponse.json({ error: 'Не передан идентификатор статьи для переимпорта.' }, { status: 400 })
      }

      result = await runB17ReimportPost(content, body.postId.trim())
      saveContent(content)
      revalidatePublicContent(content)
    } else {
      return NextResponse.json({ error: 'Неизвестное действие импорта.' }, { status: 400 })
    }

    logInfo('admin.blog_import.success', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      action,
      payload: summarizePayload(body),
      runStatus: result.run.status,
      runId: result.run.id,
    })

    return NextResponse.json({
      success: true,
      blog: normalizeBlogSection(content.blog),
      result,
    })
  } catch (error) {
    logError('admin.blog_import.error', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      error,
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Не удалось выполнить импорт B17.' },
      { status: 500 }
    )
  }
}
