export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { runB17ImportNew } from '@/lib/blog-import/service'
import { getContent, saveContent } from '@/lib/content'
import { revalidatePublicContent } from '@/lib/content-revalidation'

function isAuthorized(request: NextRequest, secret: string) {
  const headerSecret = request.headers.get('x-cron-secret')
  const querySecret = request.nextUrl.searchParams.get('secret')
  const bearerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  return headerSecret === secret || querySecret === secret || bearerToken === secret
}

export async function GET(request: NextRequest) {
  const secret = process.env.B17_IMPORT_CRON_SECRET?.trim()

  if (!secret) {
    return NextResponse.json(
      { error: 'B17_IMPORT_CRON_SECRET is not configured.' },
      { status: 503 }
    )
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: 'Unauthorized cron request.' }, { status: 401 })
  }

  const content = getContent()

  if (!content.blog.imports.b17.enabled) {
    return NextResponse.json(
      { skipped: true, message: 'B17 import is disabled in blog settings.' },
      { status: 200 }
    )
  }

  const result = await runB17ImportNew(content)
  saveContent(content)
  revalidatePublicContent(content)

  return NextResponse.json({
    success: true,
    run: result.run,
    operations: result.operations,
  })
}
