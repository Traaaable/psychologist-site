import type { MetadataRoute } from 'next'
import { getPublishedBlogPosts } from '@/lib/blog'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  const content = getContent()
  const baseUrl = content.seo.siteUrl || 'http://localhost:3000'
  const lastModified = new Date(content._meta.lastUpdated || Date.now())
  const blogPosts = getPublishedBlogPosts(content)

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || content._meta.lastUpdated || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
