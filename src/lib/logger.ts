import type { NextRequest } from 'next/server'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

function normalizeLogLevel(value?: string): LogLevel {
  switch (value?.toLowerCase()) {
    case 'debug':
    case 'info':
    case 'warn':
    case 'error':
      return value.toLowerCase() as LogLevel
    default:
      return 'info'
  }
}

function currentLogLevel(): LogLevel {
  return process.env.DEBUG_MODE === 'true'
    ? 'debug'
    : normalizeLogLevel(process.env.LOG_LEVEL)
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLogLevel()]
}

function outputMethod(level: LogLevel): 'log' | 'warn' | 'error' {
  if (level === 'warn') return 'warn'
  if (level === 'error') return 'error'
  return 'log'
}

function isSensitiveKey(key: string): boolean {
  return /(password|secret|token|cookie|authorization)/i.test(key)
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, (key, currentValue: unknown) => {
      if (currentValue instanceof Error) {
        return {
          name: currentValue.name,
          message: currentValue.message,
          stack: currentValue.stack,
        }
      }

      if (typeof currentValue === 'string') {
        if (isSensitiveKey(key)) {
          return redact(currentValue)
        }

        if (currentValue.length > 400) {
          return `${currentValue.slice(0, 200)}... [truncated ${currentValue.length - 200} chars]`
        }
      }

      return currentValue
    })
  } catch (error) {
    return JSON.stringify({
      serializationError: true,
      error: error instanceof Error ? error.message : 'Unknown serialization error',
    })
  }
}

function emit(level: LogLevel, event: string, details?: Record<string, unknown>) {
  if (!shouldLog(level)) return

  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    details,
  }

  console[outputMethod(level)](`[app] ${safeStringify(payload)}`)
}

export function redact(value?: string | null): string | null | undefined {
  if (value === undefined) return undefined
  if (value === null) return null
  if (value.length <= 12) return '[redacted]'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

export function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getRequestMeta(request: NextRequest): Record<string, unknown> {
  return {
    method: request.method,
    path: request.nextUrl.pathname,
    search: request.nextUrl.search || undefined,
    host: request.headers.get('host') || undefined,
    protocol: request.nextUrl.protocol.replace(':', ''),
    forwardedProto: request.headers.get('x-forwarded-proto') || undefined,
    forwardedFor: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    referer: request.headers.get('referer') || undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  }
}

export function summarizePayload(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return { kind: 'array', length: value.length }
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>)
    return {
      kind: 'object',
      keyCount: keys.length,
      keys: keys.slice(0, 10),
    }
  }

  return {
    kind: value === null ? 'null' : typeof value,
  }
}

export function logDebug(event: string, details?: Record<string, unknown>) {
  emit('debug', event, details)
}

export function logInfo(event: string, details?: Record<string, unknown>) {
  emit('info', event, details)
}

export function logWarn(event: string, details?: Record<string, unknown>) {
  emit('warn', event, details)
}

export function logError(event: string, details?: Record<string, unknown>) {
  emit('error', event, details)
}
