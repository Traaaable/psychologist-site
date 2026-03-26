import { revalidatePath } from 'next/cache'
import { getPublishedBlogPosts } from '@/lib/blog'
import type { SiteContent } from '@/lib/content'

export function revalidatePublicContent(content: SiteContent) {
  const paths = [
    '/',
    '/about',
    '/services',
    '/how-it-works',
    '/pricing',
    '/faq',
    '/contact',
    '/blog',
    '/privacy',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
  ]

  revalidatePath('/', 'layout')

  for (const path of paths) {
    revalidatePath(path)
  }

  for (const post of getPublishedBlogPosts(content)) {
    revalidatePath(`/blog/${post.slug}`)
  }
}
