export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getContent, saveContent, type SiteContent } from '@/lib/content'
import { isAuthenticatedFromRequest } from '@/lib/auth'

function unauthorized() {
  return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorized()
  try {
    const content = getContent()
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Не удалось загрузить данные' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) return unauthorized()
  try {
    const body = await request.json() as { section: keyof SiteContent; data: unknown }
    const { section, data } = body

    if (!section || data === undefined) {
      return NextResponse.json({ error: 'Не указан раздел или данные' }, { status: 400 })
    }

    if (section === '_meta') {
      return NextResponse.json({ error: 'Этот раздел нельзя редактировать' }, { status: 403 })
    }

    const current = getContent()
    const updated = { ...current, [section]: data } as SiteContent
    saveContent(updated)

    return NextResponse.json({ success: true, lastUpdated: updated._meta.lastUpdated })
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    return NextResponse.json({ error: 'Не удалось сохранить данные' }, { status: 500 })
  }
}
