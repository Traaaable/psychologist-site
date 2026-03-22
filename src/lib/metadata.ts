import type { Metadata } from 'next'
import { getContent } from './content'

function getMetadataSource() {
  try {
    return getContent()
  } catch {
    return null
  }
}

function getSiteUrl() {
  return getMetadataSource()?.seo.siteUrl || 'http://localhost:3000'
}

function getBrandName() {
  const content = getMetadataSource()

  return (
    content?.specialist.shortName ||
    content?.specialist.name ||
    content?.seo.siteName ||
    'Психолог'
  )
}

export function generatePageMetadata({
  title,
  description,
  path,
  pageKey,
  image,
}: {
  title: string
  description: string
  path: string
  pageKey?: string
  image?: string
}): Metadata {
  const content = getMetadataSource()
  const siteUrl = getSiteUrl()
  const brandName = getBrandName()
  const seoPage = pageKey ? content?.seo.pages?.[pageKey] : undefined
  const resolvedTitle = seoPage?.title || title
  const resolvedDescription =
    seoPage?.description || description || content?.seo.defaultDescription || ''
  const url = `${siteUrl}${path}`
  const ogImage = image || '/og-image.jpg'

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${resolvedTitle} | ${brandName}`,
      description: resolvedDescription,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${resolvedTitle} | ${brandName}`,
      description: resolvedDescription,
      images: [ogImage],
    },
  }
}
