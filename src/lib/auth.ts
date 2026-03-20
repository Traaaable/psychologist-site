/**
 * Авторизация для админки.
 * Использует Web Crypto API — работает в Edge, Node и браузере.
 * Сессия — HTTP-only cookie с подписанным токеном.
 */

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { logDebug, redact } from '@/lib/logger'

const SECRET = process.env.ADMIN_SECRET || 'change-me-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

// HMAC-SHA256 через Web Crypto API (работает в Edge)
async function hmacSign(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const msgData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacVerify(message: string, key: string, sig: string): Promise<boolean> {
  const expected = await hmacSign(message, key)
  if (expected.length !== sig.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  }
  return diff === 0
}

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export async function createSessionToken(): Promise<string> {
  const payload = `${Date.now()}.${Math.random().toString(36).substring(2)}`
  const signature = await hmacSign(payload, SECRET)
  const token = `${payload}.${signature}`

  logDebug('auth.session.created', {
    tokenPreview: redact(token),
    issuedAt: payload.split('.')[0],
  })

  return token
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const tokenPreview = redact(token)
  const lastDot = token.lastIndexOf('.')
  if (lastDot === -1) {
    logDebug('auth.session.invalid_format', { tokenPreview })
    return false
  }
  const payload = token.substring(0, lastDot)
  const signature = token.substring(lastDot + 1)

  const valid = await hmacVerify(payload, SECRET, signature)
  if (!valid) {
    logDebug('auth.session.invalid_signature', { tokenPreview })
    return false
  }

  const [tsStr] = payload.split('.')
  const ts = parseInt(tsStr, 10)
  if (isNaN(ts)) {
    logDebug('auth.session.invalid_timestamp', { tokenPreview, payload })
    return false
  }

  const ageMs = Date.now() - ts
  const isValid = ageMs < SESSION_DURATION

  logDebug(isValid ? 'auth.session.valid' : 'auth.session.expired', {
    tokenPreview,
    ageMs,
    sessionDurationMs: SESSION_DURATION,
  })

  return isValid
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) {
      logDebug('auth.cookies.missing', { cookieName: COOKIE_NAME })
      return false
    }

    const authenticated = await verifySessionToken(token)
    logDebug('auth.cookies.checked', {
      cookieName: COOKIE_NAME,
      authenticated,
      tokenPreview: redact(token),
    })

    return authenticated
  } catch {
    logDebug('auth.cookies.read_failed')
    return false
  }
}

export async function isAuthenticatedFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    logDebug('auth.request_cookie.missing', {
      cookieName: COOKIE_NAME,
      path: request.nextUrl.pathname,
    })
    return false
  }

  const authenticated = await verifySessionToken(token)
  logDebug('auth.request_cookie.checked', {
    cookieName: COOKIE_NAME,
    path: request.nextUrl.pathname,
    authenticated,
    tokenPreview: redact(token),
  })

  return authenticated
}

export { COOKIE_NAME, SESSION_DURATION }
