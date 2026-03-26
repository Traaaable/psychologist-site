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

function getAbsoluteUrl(path: string) {
  const siteUrl = getSiteUrl()
  return `${siteUrl}${path}`
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
  openGraphType = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  robots,
}: {
  title: string
  description: string
  path: string
  pageKey?: string
  image?: string
  openGraphType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  robots?: Metadata['robots']
}): Metadata {
  const content = getMetadataSource()
  const brandName = getBrandName()
  const seoPage = pageKey ? content?.seo.pages?.[pageKey] : undefined
  const resolvedTitle = seoPage?.title || title
  const resolvedDescription =
    seoPage?.description || description || content?.seo.defaultDescription || ''
  const url = getAbsoluteUrl(path)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords,
    robots,
    alternates: { canonical: url },
    openGraph: {
      type: openGraphType,
      title: `${resolvedTitle} | ${brandName}`,
      description: resolvedDescription,
      url,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      title: `${resolvedTitle} | ${brandName}`,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export { getAbsoluteUrl }
