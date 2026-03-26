export const runtime = 'nodejs'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import { createRequestId, getRequestMeta, logError, logInfo, logWarn } from '@/lib/logger'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE = 15 * 1024 * 1024

const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/heic': '.heic',
  'image/heif': '.heif',
  'image/bmp': '.bmp',
  'image/tiff': '.tif',
  'image/x-icon': '.ico',
}

function isImageType(fileType: string) {
  return fileType.startsWith('image/')
}

function getSafeExtension(file: File) {
  const mimeExtension = MIME_EXTENSION_MAP[file.type]
  if (mimeExtension) {
    return mimeExtension
  }

  const rawExtension = path.extname(file.name).toLowerCase()
  if (rawExtension && /^\.[a-z0-9]+$/i.test(rawExtension)) {
    return rawExtension
  }

  const subtype = file.type
    .split('/')[1]
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  return subtype ? `.${subtype}` : '.img'
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId()
  const requestMeta = getRequestMeta(request)
  const startedAt = Date.now()

  logInfo('admin.upload.request', { requestId, ...requestMeta })

  if (!(await isAuthenticatedFromRequest(request))) {
    logWarn('admin.upload.unauthorized', { requestId, ...requestMeta })
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      logWarn('admin.upload.validation_failed', {
        requestId,
        ...requestMeta,
        reason: 'missing_file',
      })
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 })
    }

    if (!isImageType(file.type)) {
      logWarn('admin.upload.validation_failed', {
        requestId,
        ...requestMeta,
        reason: 'unsupported_type',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      logWarn('admin.upload.validation_failed', {
        requestId,
        ...requestMeta,
        reason: 'file_too_large',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        maxSize: MAX_SIZE,
      })
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер — 15 МБ' },
        { status: 400 }
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = getSafeExtension(file)
    const safeName = `photo-${Date.now()}${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)
    const buffer = Buffer.from(await file.arrayBuffer())

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${safeName}`
    logInfo('admin.upload.success', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      savedAs: safeName,
      publicUrl,
    })

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err) {
    logError('admin.upload.error', {
      requestId,
      ...requestMeta,
      durationMs: Date.now() - startedAt,
      error: err,
    })
    console.error('Ошибка загрузки файла:', err)
    return NextResponse.json({ error: 'Не удалось загрузить файл' }, { status: 500 })
  }
}
