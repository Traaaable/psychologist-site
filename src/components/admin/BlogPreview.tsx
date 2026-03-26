'use client'

import Link from 'next/link'
import { BlogBlocks } from '@/components/blog/BlogBlocks'
import type { BlogPost } from '@/lib/blog-schema'
import { formatBlogDate, getBlogReadTime } from '@/lib/blog-utils'

interface PreviewLinkItem {
  id: string
  title: string
  description: string
  href: string
}

interface BlogPreviewProps {
  post: BlogPost
  authorName: string
  authorTitle: string
  authorMeta?: string
  relatedServices: PreviewLinkItem[]
  relatedPages: PreviewLinkItem[]
}

export function BlogPreview({
  post,
  authorName,
  authorTitle,
  authorMeta,
  relatedServices,
  relatedPages,
}: BlogPreviewProps) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-[#faf7f0] px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#517a63]">
          Предпросмотр статьи
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Черновой вид страницы. Так статья будет выглядеть на сайте после публикации.
        </div>
      </div>

      <div className="space-y-8 px-6 py-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            {post.category ? <span className="badge badge-sage">{post.category}</span> : null}
            <span>{formatBlogDate(post.publishedAt || post.updatedAt) || 'Дата появится после публикации'}</span>
            <span>•</span>
            <span>{getBlogReadTime(post)} чтения</span>
          </div>

          <h2 className="font-serif text-4xl leading-tight text-[var(--color-stone-800)]">
            {post.title || 'Заголовок статьи'}
          </h2>

          <p className="text-base leading-7 text-gray-500">
            {post.excerpt || 'Короткий анонс статьи появится здесь.'}
          </p>
        </div>

        {post.coverImage ? (
          <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-gray-50">
            <img src={post.coverImage} alt={post.coverAlt || post.title || 'Обложка статьи'} className="max-h-80 w-full object-cover" />
          </div>
        ) : null}

        <BlogBlocks blocks={post.content} />

        <div className="rounded-[28px] border border-[#d8e4db] bg-[#eef2ef] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#517a63]">
            CTA
          </div>
          <div className="mt-4 font-serif text-3xl text-[var(--color-stone-800)]">
            {post.cta.title}
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--color-stone-600)]">
            {post.cta.description}
          </p>
          <div className="mt-5">
            <span className="btn-primary inline-flex">{post.cta.label}</span>
          </div>
        </div>

        {relatedServices.length > 0 ? (
          <div className="space-y-3">
            <div className="font-serif text-2xl text-[var(--color-stone-800)]">
              Связанные услуги
            </div>
            <div className="space-y-3">
              {relatedServices.map((service) => (
                <div key={service.id} className="rounded-2xl border border-gray-100 bg-[#faf7f0] p-4">
                  <div className="font-medium text-[var(--color-stone-800)]">{service.title}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-500">{service.description}</div>
                  <div className="mt-2 text-xs text-[#517a63]">{service.href}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {relatedPages.length > 0 ? (
          <div className="space-y-3">
            <div className="font-serif text-2xl text-[var(--color-stone-800)]">
              Связанные страницы сайта
            </div>
            <div className="space-y-3">
              {relatedPages.map((page) => (
                <div key={page.id} className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="font-medium text-[var(--color-stone-800)]">{page.title}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-500">{page.description}</div>
                  <div className="mt-2 text-xs text-[#517a63]">{page.href}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[28px] border border-gray-100 bg-[#faf7f0] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#517a63]">
            Автор
          </div>
          <div className="mt-3 font-serif text-3xl text-[var(--color-stone-800)]">
            {authorName}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {authorTitle}
            {authorMeta ? ` • ${authorMeta}` : ''}
          </div>
          <div className="mt-4">
            <Link href="/about" className="text-sm font-medium text-[#517a63] underline underline-offset-4">
              Страница «Обо мне»
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
