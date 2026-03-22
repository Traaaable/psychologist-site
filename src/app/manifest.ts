import type { MetadataRoute } from 'next'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function manifest(): MetadataRoute.Manifest {
  const content = getContent()
  const siteName =
    content.seo.siteName || content.specialist.name || content.specialist.shortName || 'Психолог'

  return {
    name: siteName,
    short_name: content.specialist.shortName || content.specialist.name || 'Психолог',
    description: content.seo.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfcf8',
    theme_color: '#517a63',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
