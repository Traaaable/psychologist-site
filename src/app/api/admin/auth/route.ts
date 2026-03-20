export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, createSessionToken, COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Введите пароль' }, { status: 400 })
    }

    if (!checkPassword(password)) {
      await new Promise(r => setTimeout(r, 500))
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

    return response
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
