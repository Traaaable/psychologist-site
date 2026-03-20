export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSessionToken, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'
import { createRequestId, getRequestMeta, logError, logInfo, logWarn, redact } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)
  const startedAt = Date.now()

  logInfo('admin.auth.login.request', { requestId, ...requestMeta })

  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      logWarn('admin.auth.login.validation_failed', {
        requestId,
        ...requestMeta,
        reason: 'missing_password',
      })
      return NextResponse.json({ error: 'Введите пароль' }, { status: 400 })
    }

    if (!checkPassword(password)) {
      await new Promise(r => setTimeout(r, 500))
      logWarn('admin.auth.login.invalid_password', {
        requestId,
        ...requestMeta,
        passwordLength: password.length,
        durationMs: Date.now() - startedAt,
      })
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }

    const token = await createSessionToken()
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isHttps = request.nextUrl.protocol === 'https:' || forwardedProto === 'https'
    const secureCookieMode = process.env.ADMIN_COOKIE_SECURE?.toLowerCase()
    const shouldUseSecureCookie = secureCookieMode === 'true'
      ? true
      : secureCookieMode === 'false'
        ? false
        : process.env.NODE_ENV === 'production' && isHttps

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: shouldUseSecureCookie,
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    })
    logInfo('admin.auth.login.success', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      secureCookieMode: secureCookieMode ?? 'auto',
      secureCookie: shouldUseSecureCookie,
      cookieName: COOKIE_NAME,
      tokenPreview: redact(token),
    })

    return response
  } catch (error) {
    logError('admin.auth.login.error', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      error,
    })
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)

  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)

  logInfo('admin.auth.logout.success', {
    requestId,
    ...requestMeta,
    cookieName: COOKIE_NAME,
  })

  return response
}
