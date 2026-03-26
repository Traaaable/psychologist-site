import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogListClient } from '@/components/blog/BlogListClient'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import {
  getBlogCategories,
  getBlogCollectionJsonLd,
  getBlogPageDescription,
  getBlogPageHeading,
  getBlogTags,
  getPublishedBlogPosts,
} from '@/lib/blog'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  const content = getContent()

  return generatePageMetadata({
    title: getBlogPageHeading(content),
    description: getBlogPageDescription(content),
    path: '/blog',
    pageKey: 'blog',
  })
}

export default function BlogPage() {
  const content = getContent()
  const posts = getPublishedBlogPosts(content)
  const categories = getBlogCategories(posts)
  const tags = getBlogTags(posts)
  const blogHeading = getBlogPageHeading(content)
  const blogDescription = getBlogPageDescription(content)
  const latestPost = posts[0]
  const blogJsonLd = getBlogCollectionJsonLd(content)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="relative overflow-hidden bg-[var(--color-cream-100)] px-4 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-sage-500)] opacity-[0.05] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Блог' }]}
            className="mb-8"
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)]"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-sage-600)]">
                  Полезные материалы
                </span>
              </div>

              <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-sage-200)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--color-sage-700)] shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-500)]" />
                <span>{posts.length} статей для блога и SEO</span>
              </div>

              <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[var(--color-stone-800)] md:text-6xl lg:text-7xl">
                {blogHeading}
              </h1>

              <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-stone-500)] md:text-xl">
                {blogDescription}
              </p>
            </div>

            <div className="rounded-[32px] border border-[var(--color-stone-200)] bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-600)]">
                Зачем читать блог
              </div>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-stone-500)]">
                <p>Статьи помогают лучше понять свое состояние и увидеть, что с этим можно делать дальше.</p>
                <p>В каждом материале есть удобные переходы на консультацию, направления помощи и другие полезные страницы сайта.</p>
              </div>
              {latestPost ? (
                <Link
                  href={`/blog/${latestPost.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-sage-700)] transition-colors hover:text-[var(--color-sage-800)]"
                >
                  Начать с последней статьи
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {posts.length > 0 ? (
            <BlogListClient posts={posts} categories={categories} tags={tags} />
          ) : (
            <div className="rounded-[32px] border border-dashed border-[var(--color-stone-300)] bg-[var(--color-cream-100)] px-6 py-14 text-center">
              <h2 className="font-serif text-4xl text-[var(--color-stone-800)]">
                Блог скоро наполнится статьями
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--color-stone-500)]">
                Пока можно перейти к основным страницам сайта: узнать о подходе, посмотреть направления помощи или сразу записаться на консультацию.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/services" className="btn-secondary">
                  Посмотреть направления помощи
                </Link>
                <Link href="/contact" className="btn-primary">
                  Записаться на консультацию
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Нужна не только статья, но и живая поддержка?"
        subtitle="Если вы узнали в материале свою ситуацию, можно спокойно обсудить ее на консультации и выбрать понятный следующий шаг."
      />
    </>
  )
}
