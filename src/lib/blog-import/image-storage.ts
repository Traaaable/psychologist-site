import { createHash } from 'crypto'
import { mkdir, stat, writeFile } from 'fs/promises'
import path from 'path'
import { normalizeAbsoluteUrl } from '@/lib/blog-import/shared'

const IMPORT_IMAGE_DIR = path.join(process.cwd(), 'public', 'uploads', 'imports', 'b17')

const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

const FETCH_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
  referer: 'https://www.b17.ru/',
}

function resolveExtension(contentType: string | null, imageUrl: string) {
  const mimeExtension = contentType ? MIME_EXTENSION_MAP[contentType.toLowerCase()] : undefined

  if (mimeExtension) {
    return mimeExtension
  }

  const cleanPath = new URL(imageUrl).pathname
  const rawExtension = path.extname(cleanPath).toLowerCase()

  if (rawExtension && /^\.[a-z0-9]+$/i.test(rawExtension) && rawExtension !== '.svg') {
    return rawExtension
  }

  return '.jpg'
}

export async function storeB17Image(sourceUrl: string) {
  const absoluteUrl = normalizeAbsoluteUrl(sourceUrl)

  if (!absoluteUrl) {
    return {
      src: '',
      isLocal: false,
      error: 'Не удалось нормализовать URL изображения',
    }
  }

  await mkdir(IMPORT_IMAGE_DIR, { recursive: true })

  const fileHash = createHash('sha256').update(absoluteUrl).digest('hex').slice(0, 24)
  let filePath = ''
  let fileName = ''

  for (const extension of Object.values(MIME_EXTENSION_MAP)) {
    const candidate = `${fileHash}${extension}`
    const candidatePath = path.join(IMPORT_IMAGE_DIR, candidate)

    try {
      await stat(candidatePath)

      return {
        src: `/uploads/imports/b17/${candidate}`,
        isLocal: true,
      }
    } catch {
      continue
    }
  }

  const response = await fetch(absoluteUrl, {
    headers: FETCH_HEADERS,
    cache: 'no-store',
  })

  if (!response.ok) {
    return {
      src: absoluteUrl,
      isLocal: false,
      error: `B17 вернул HTTP ${response.status} при загрузке изображения`,
    }
  }

  const contentType = response.headers.get('content-type')

  if (!contentType?.startsWith('image/')) {
    return {
      src: absoluteUrl,
      isLocal: false,
      error: 'Внешний ресурс не выглядит как изображение',
    }
  }

  if (contentType.toLowerCase() === 'image/svg+xml') {
    return {
      src: absoluteUrl,
      isLocal: false,
      error: 'SVG не копируется локально по соображениям безопасности',
    }
  }

  const extension = resolveExtension(contentType, absoluteUrl)
  fileName = `${fileHash}${extension}`
  filePath = path.join(IMPORT_IMAGE_DIR, fileName)

  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(filePath, buffer)

  return {
    src: `/uploads/imports/b17/${fileName}`,
    isLocal: true,
  }
}
