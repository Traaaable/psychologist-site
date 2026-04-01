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

      <section className="page-hero px-4 py-14 md:py-20">
        <div className="section-shell relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Блог' }]}
            className="mb-8"
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl space-y-6">
              <span className="eyebrow">
                <span>Блог психолога</span>
              </span>

              <span className="meta-pill">{posts.length} статей</span>

              <h1 className="text-[3rem] leading-[0.96] text-[var(--color-stone-800)] md:text-[4.1rem]">
                {blogHeading}
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-[var(--color-stone-500)] md:text-xl">
                {blogDescription}
              </p>
            </div>

            <div className="panel-strong p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-600)]">
                Зачем читать блог
              </div>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-stone-500)]">
                <p>Статьи помогают лучше понять своё состояние и увидеть, что с этим можно делать дальше.</p>
                <p>Блог поддерживает доверие, экспертность и SEO, оставаясь частью общей спокойной дизайн-системы сайта.</p>
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

      <section className="section-space bg-white px-4">
        <div className="section-shell">
          {posts.length > 0 ? (
            <BlogListClient posts={posts} categories={categories} tags={tags} />
          ) : (
            <div className="panel-strong border-dashed px-6 py-14 text-center">
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
