import type { Metadata } from 'next'
import { SITE_CONFIG } from './constants'

// Базовые метаданные сайта
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — психолог | Консультации в Москве и онлайн`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'психолог Москва',
    'психологическая консультация',
    'онлайн психолог',
    'тревожность помощь',
    'психолог выгорание',
    'работа с психологом',
    'индивидуальная терапия',
    'психотерапия Москва',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.name} — психолог`,
    title: `${SITE_CONFIG.name} — психолог | Консультации в Москве и онлайн`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — психолог`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — психолог`,
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

// Генератор метаданных для страниц
export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const ogImage = image || '/og-image.jpg'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [ogImage],
    },
  }
}
