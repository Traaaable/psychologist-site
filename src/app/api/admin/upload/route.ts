export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { isAuthenticatedFromRequest } from '@/lib/auth'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Разрешены только изображения: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер — 5 МБ' },
        { status: 400 }
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = path.extname(file.name).toLowerCase() || '.jpg'
    const safeName = `photo-${Date.now()}${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${safeName}`
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err) {
    console.error('Ошибка загрузки файла:', err)
    return NextResponse.json({ error: 'Не удалось загрузить файл' }, { status: 500 })
  }
}
