import {
  normalizeBlogSection,
  type BlogPost,
  type BlogSection,
} from '@/lib/blog-schema'
import { SITE_PAGE_LINKS, type SitePageLink } from '@/lib/blog-utils'
import { getContent, type ServiceItem, type SiteContent } from '@/lib/content'

export interface RelatedServiceLink {
  id: string
  href: string
  title: string
  description: string
}

function getSafeSiteUrl(content: SiteContent) {
  return content.seo.siteUrl || 'http://localhost:3000'
}

export function getBlogSection(content = getContent()): BlogSection {
  return normalizeBlogSection(content.blog)
}

export function getAllBlogPosts(content = getContent()) {
  return [...getBlogSection(content).posts].sort((a, b) => {
    const left = new Date(a.publishedAt || a.updatedAt || 0).getTime()
    const right = new Date(b.publishedAt || b.updatedAt || 0).getTime()
    return right - left
  })
}

export function getPublishedBlogPosts(content = getContent()) {
  return getAllBlogPosts(content).filter((post) => post.status === 'published')
}

export function getBlogPostBySlug(slug: string, content = getContent()) {
  return getPublishedBlogPosts(content).find((post) => post.slug === slug)
}

export function getBlogPageHeading(content = getContent()) {
  const blog = getBlogSection(content)
  const city = content.location.city ? ` в ${content.location.city}` : ''

  return (
    blog.heading ||
    `Блог психолога${city}`
  )
}

export function getBlogPageDescription(content = getContent()) {
  const blog = getBlogSection(content)
  const city = content.location.city ? ` ${content.location.city}` : ''

  return (
    blog.description ||
    `Полезные статьи о тревоге, выгорании, отношениях и заботе о себе.${city ? ` Консультации${city} и онлайн.` : ''}`
  )
}

export function getSitePageLinks(content = getContent()): SitePageLink[] {
  return SITE_PAGE_LINKS
}

function getServiceHref(service: ServiceItem) {
  return `/services#${service.id}`
}

export function getRelatedServiceLinks(post: BlogPost, content = getContent()): RelatedServiceLink[] {
  const services = content.services.filter((service) => service.visible)

  return post.serviceIds
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service): service is ServiceItem => Boolean(service))
    .map((service) => ({
      id: service.id,
      href: getServiceHref(service),
      title: service.title,
      description: service.shortDesc,
    }))
}

export function getRelatedPageLinks(post: BlogPost, content = getContent()) {
  const pageLinks = getSitePageLinks(content)

  return post.relatedPageKeys
    .map((key) => pageLinks.find((link) => link.key === key))
    .filter((link): link is SitePageLink => Boolean(link))
}

export function getPrimaryBlogCta(post: BlogPost, content = getContent()) {
  const relatedService = getRelatedServiceLinks(post, content)[0]
  const relatedPage = getRelatedPageLinks(post, content)[0]

  return {
    title: post.cta.title,
    description: post.cta.description,
    label: post.cta.label,
    href: post.cta.href || relatedService?.href || relatedPage?.href || '/contact',
  }
}

function getOverlapScore(currentPost: BlogPost, candidate: BlogPost) {
  let score = 0

  if (currentPost.category && currentPost.category === candidate.category) {
    score += 5
  }

  const sharedTags = currentPost.tags.filter((tag) => candidate.tags.includes(tag))
  const sharedServices = currentPost.serviceIds.filter((id) => candidate.serviceIds.includes(id))

  score += sharedTags.length * 3
  score += sharedServices.length * 4

  return score
}

export function getRelatedBlogPosts(post: BlogPost, allPosts: BlogPost[], limit = 3) {
  const manual = post.relatedPostIds
    .map((relatedId) => allPosts.find((candidate) => candidate.id === relatedId))
    .filter((candidate): candidate is BlogPost => Boolean(candidate))

  const auto = allPosts
    .filter((candidate) => candidate.id !== post.id && !manual.some((item) => item.id === candidate.id))
    .map((candidate) => ({
      candidate,
      score: getOverlapScore(post, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((item) => item.candidate)

  return [...manual, ...auto].slice(0, limit)
}

export function getBlogCategories(posts: BlogPost[]) {
  return [...new Set(posts.map((post) => post.category.trim()).filter(Boolean))]
}

export function getBlogTags(posts: BlogPost[]) {
  return [...new Set(posts.flatMap((post) => post.tags).map((tag) => tag.trim()).filter(Boolean))]
}

export function resolveBlogImageUrl(image: string | undefined, content = getContent()) {
  if (!image) {
    return undefined
  }

  if (/^https?:\/\//.test(image)) {
    return image
  }

  return `${getSafeSiteUrl(content)}${image.startsWith('/') ? image : `/${image}`}`
}

export function getBlogPostMetadataTitle(post: BlogPost, content = getContent()) {
  return (
    post.seo.title ||
    `${post.title}${content.location.city ? ` | Психолог ${content.location.city}` : ''}`
  )
}

export function getBlogPostMetadataDescription(post: BlogPost, content = getContent()) {
  return (
    post.seo.description ||
    post.excerpt ||
    content.seo.defaultDescription
  )
}

export function getBlogCollectionJsonLd(content = getContent()) {
  const posts = getPublishedBlogPosts(content)
  const siteUrl = getSafeSiteUrl(content)

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: getBlogPageHeading(content),
    description: getBlogPageDescription(content),
    url: `${siteUrl}/blog`,
    blogPost: posts.slice(0, 12).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      url: `${siteUrl}/blog/${post.slug}`,
    })),
  }
}
