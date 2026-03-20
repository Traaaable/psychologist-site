/**
 * Авторизация для админки.
 * Использует Web Crypto API — работает в Edge, Node и браузере.
 * Сессия — HTTP-only cookie с подписанным токеном.
 */

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

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
  return `${payload}.${signature}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.')
  if (lastDot === -1) return false
  const payload = token.substring(0, lastDot)
  const signature = token.substring(lastDot + 1)

  const valid = await hmacVerify(payload, SECRET, signature)
  if (!valid) return false

  const [tsStr] = payload.split('.')
  const ts = parseInt(tsStr, 10)
  if (isNaN(ts)) return false

  return Date.now() - ts < SESSION_DURATION
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return verifySessionToken(token)
  } catch {
    return false
  }
}

export async function isAuthenticatedFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifySessionToken(token)
}

export { COOKIE_NAME, SESSION_DURATION }
