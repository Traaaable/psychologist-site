export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getContent, saveContent, type SiteContent } from '@/lib/content'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import { createRequestId, getRequestMeta, logError, logInfo, logWarn, summarizePayload } from '@/lib/logger'

function unauthorized() {
  return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
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
    const updated = { ...current, [section]: data } as SiteContent
    saveContent(updated)
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
