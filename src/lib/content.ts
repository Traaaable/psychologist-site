/**
 * Библиотека для работы с контентом сайта.
 * Данные хранятся в /data/content.json и читаются на сервере.
 * Не используется на клиенте напрямую — только через API-роуты или Server Components.
 */

import fs from 'fs'
import path from 'path'
import { logDebug, logError, logInfo } from '@/lib/logger'

// Путь к файлу данных
const DATA_FILE = path.join(process.cwd(), 'data', 'content.json')

// ============================
// ТИПЫ ДАННЫХ
// ============================

export interface EducationItem {
  id: string
  year: string
  institution: string
  description: string
  type: 'education' | 'practice'
}

export interface CertificateItem {
  id: string
  year: string
  title: string
  description: string
}

export interface ServiceItem {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  icon: string
  visible: boolean
}

export interface PricingItem {
  id: string
  title: string
  price: string
  pricePerSession?: string
  duration: string
  format?: string
  description: string
  features: string[]
  isPopular: boolean
  visible: boolean
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  visible: boolean
}

export interface SiteContent {
  specialist: {
    name: string
    shortName: string
    title: string
    tagline: string
    experience: string
    sessionsCount: string
    photo: string
    heroText: string
    heroSubtitle: string
  }
  contacts: {
    phone: string
    email: string
    telegram: string
    whatsapp: string
    vk: string
    workingHours: string
  }
  location: {
    city: string
    address: string
    showAddress: boolean
    consultationFormat: 'offline' | 'online' | 'both'
    formatNote: string
  }
  about: {
    mainText: string
    approach: string
    values: string
    quote: string
  }
  education: EducationItem[]
  certificates: CertificateItem[]
  services: ServiceItem[]
  pricing: PricingItem[]
  faq: FaqItem[]
  seo: {
    siteName: string
    siteUrl: string
    defaultDescription: string
    pages: Record<string, { title: string; description: string }>
  }
  _meta: {
    lastUpdated: string
    version: string
  }
}

// ============================
// ЧТЕНИЕ ДАННЫХ
// ============================

export function getContent(): SiteContent {
  try {
    logDebug('content.read.start', { file: DATA_FILE })
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const content = JSON.parse(raw) as SiteContent
    logDebug('content.read.success', {
      file: DATA_FILE,
      sizeBytes: Buffer.byteLength(raw, 'utf-8'),
      version: content._meta.version,
      lastUpdated: content._meta.lastUpdated,
    })
    return content
  } catch (error) {
    logError('content.read.error', { file: DATA_FILE, error })
    throw new Error('Не удалось прочитать файл контента. Проверьте, что файл data/content.json существует.')
  }
}

// ============================
// ЗАПИСЬ ДАННЫХ
// ============================

export function saveContent(data: SiteContent): void {
  // Обновляем метаданные
  data._meta.lastUpdated = new Date().toISOString()

  // Создаём папку, если не существует
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Атомарная запись: сначала во временный файл, потом переименовываем
  const tmpFile = DATA_FILE + '.tmp'
  const serialized = JSON.stringify(data, null, 2)
  fs.writeFileSync(tmpFile, serialized, 'utf-8')
  fs.renameSync(tmpFile, DATA_FILE)

  logInfo('content.write.success', {
    file: DATA_FILE,
    sizeBytes: Buffer.byteLength(serialized, 'utf-8'),
    version: data._meta.version,
    lastUpdated: data._meta.lastUpdated,
  })
}

// ============================
// ЧАСТИЧНОЕ ОБНОВЛЕНИЕ
// ============================

export function updateContent(section: keyof SiteContent, data: unknown): SiteContent {
  const current = getContent()
  const updated = {
    ...current,
    [section]: data,
  } as SiteContent
  saveContent(updated)
  return updated
}

// ============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================

export function getConsultationFormatLabel(format: string): string {
  const labels: Record<string, string> = {
    offline: 'Очно (в офисе)',
    online: 'Онлайн',
    both: 'Очно + Онлайн',
  }
  return labels[format] || format
}
