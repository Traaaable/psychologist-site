import { load } from 'cheerio'

const MONTHS: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
}

const DEFAULT_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  'accept-language': 'ru-RU,ru;q=0.9,en;q=0.8',
}

export class ExternalImportError extends Error {
  code: string
  articleUrl?: string

  constructor(message: string, code = 'external_import_error', articleUrl?: string) {
    super(message)
    this.name = 'ExternalImportError'
    this.code = code
    this.articleUrl = articleUrl
  }
}

export function normalizeAbsoluteUrl(input: string, baseUrl = 'https://www.b17.ru') {
  if (!input.trim()) {
    return ''
  }

  try {
    return new URL(input, baseUrl).toString()
  } catch {
    return ''
  }
}

export function normalizeWhitespace(value: string) {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateText(value: string, maxLength: number) {
  const normalized = normalizeWhitespace(value)

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

function detectCharset(contentType: string | null, htmlSnippet: string) {
  const headerMatch = contentType?.match(/charset=([^;]+)/i)
  const metaMatch = htmlSnippet.match(/charset=([\w-]+)/i)
  const raw = (headerMatch?.[1] || metaMatch?.[1] || 'utf-8').trim().toLowerCase()

  if (raw === 'windows-1251' || raw === 'cp1251' || raw === 'win-1251') {
    return 'windows-1251'
  }

  return 'utf-8'
}

export async function fetchExternalHtml(url: string) {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new ExternalImportError(
      `Источник вернул HTTP ${response.status} для ${url}`,
      'upstream_http_error',
      url
    )
  }

  const buffer = await response.arrayBuffer()
  const preview = Buffer.from(buffer).toString('latin1', 0, Math.min(buffer.byteLength, 2048))
  const charset = detectCharset(response.headers.get('content-type'), preview)
  const decoder = new TextDecoder(charset)
  const html = decoder.decode(buffer).replace(/^\uFEFF/, '')

  return {
    url,
    html,
  }
}

export function parseB17Date(dateLabel: string, now = new Date()) {
  const normalized = normalizeWhitespace(dateLabel).toLowerCase()

  if (!normalized) {
    return undefined
  }

  const relativeMatch = normalized.match(/^(сегодня|вчера)(?:\s*-\s*(\d{1,2}):(\d{2}))?$/)
  if (relativeMatch) {
    const [, keyword, hoursRaw, minutesRaw] = relativeMatch
    const baseDate = new Date(now)
    const delta = keyword === 'вчера' ? 1 : 0
    baseDate.setDate(baseDate.getDate() - delta)

    const hours = Number(hoursRaw || 12)
    const minutes = Number(minutesRaw || 0)

    return new Date(
      Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hours,
        minutes,
        0
      )
    ).toISOString()
  }

  const match = normalized.match(/^(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?$/)
  if (!match) {
    return undefined
  }

  const [, dayRaw, monthRaw, yearRaw] = match
  const month = MONTHS[monthRaw]

  if (month === undefined) {
    return undefined
  }

  const day = Number(dayRaw)
  let year = Number(yearRaw)

  if (!year) {
    year = now.getFullYear()
    const candidate = new Date(Date.UTC(year, month, day, 12, 0, 0))

    if (candidate.getTime() > now.getTime() + 48 * 60 * 60 * 1000) {
      year -= 1
    }
  }

  return new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString()
}

export function decodeHtmlEntities(value: string) {
  return load(`<span>${value}</span>`).text()
}

export function stripHtml(value: string) {
  return normalizeWhitespace(load(`<div>${value}</div>`).text())
}
