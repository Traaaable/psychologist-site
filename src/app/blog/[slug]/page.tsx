import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogBlocks } from '@/components/blog/BlogBlocks'
import { BlogCard } from '@/components/blog/BlogCard'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import {
  getBlogPostBySlug,
  getBlogPostMetadataDescription,
  getBlogPostMetadataTitle,
  getPrimaryBlogCta,
  getPublishedBlogPosts,
  getRelatedBlogPosts,
  getRelatedPageLinks,
  getRelatedServiceLinks,
  resolveBlogImageUrl,
} from '@/lib/blog'
import { formatBlogDate, getBlogReadTime } from '@/lib/blog-utils'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const content = getContent()
  const post = getBlogPostBySlug(slug, content)

  if (!post) {
    return { title: 'Статья не найдена' }
  }

  return generatePageMetadata({
    title: getBlogPostMetadataTitle(post, content),
    description: getBlogPostMetadataDescription(post, content),
    path: `/blog/${slug}`,
    image: resolveBlogImageUrl(post.coverImage, content),
    canonicalUrl: post.seo.canonicalUrl || undefined,
    openGraphType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    keywords: [post.category, ...post.tags].filter(Boolean),
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const content = getContent()
  const post = getBlogPostBySlug(slug, content)

  if (!post) {
    notFound()
  }

  const allPosts = getPublishedBlogPosts(content)
  const relatedPosts = getRelatedBlogPosts(post, allPosts)
  const relatedServices = getRelatedServiceLinks(post, content)
  const relatedPages = getRelatedPageLinks(post, content)
  const primaryCta = getPrimaryBlogCta(post, content)
  const authorName = content.specialist.name || content.specialist.shortName || 'Психолог'
  const authorTitle = content.specialist.title || 'Психолог-консультант'
  const authorExperience = content.specialist.experience
  const authorCity = content.location.city
  const siteUrl = content.seo.siteUrl || 'http://localhost:3000'
  const articleUrl = `${siteUrl}/blog/${post.slug}`
  const articleImage = resolveBlogImageUrl(post.coverImage, content)
  const sourceOriginalUrl = post.sourceMeta?.source === 'b17' ? post.sourceMeta.originalUrl : undefined

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: getBlogPostMetadataDescription(post, content),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    mainEntityOfPage: articleUrl,
    image: articleImage,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: content.seo.siteName || authorName,
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        <header className="page-hero px-4 py-14 md:py-20">
          <div className="section-shell relative z-10">
            <Breadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: 'Блог', href: '/blog' },
                { label: post.title },
              ]}
              className="mb-8"
            />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="max-w-4xl space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-stone-500)]">
                  {post.category ? <span className="badge badge-sage">{post.category}</span> : null}
                  {sourceOriginalUrl ? <span className="badge badge-stone">Импорт из B17</span> : null}
                  <span>{formatBlogDate(post.publishedAt || post.updatedAt)}</span>
                  <span>•</span>
                  <span>{getBlogReadTime(post)} чтения</span>
                  {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                    <>
                      <span>•</span>
                      <span>Обновлено {formatBlogDate(post.updatedAt)}</span>
                    </>
                  ) : null}
                </div>

                <h1 className="text-[2.9rem] leading-[0.98] text-[var(--color-stone-800)] md:text-[4rem]">
                  {post.title}
                </h1>

                <p className="max-w-3xl text-lg leading-8 text-[var(--color-stone-500)] md:text-xl">
                  {post.excerpt}
                </p>
              </div>

              <aside className="panel-strong p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-600)]">
                  Полезный переход
                </div>
                <div className="mt-4 space-y-4">
                  <div className="font-serif text-2xl text-[var(--color-stone-800)]">
                    {primaryCta.title}
                  </div>
                  <p className="text-sm leading-7 text-[var(--color-stone-500)]">
                    {primaryCta.description}
                  </p>
                  <Link href={primaryCta.href} className="btn-primary w-full">
                    {primaryCta.label}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </header>

        {post.coverImage ? (
          <section className="bg-white px-4 pt-10">
            <div className="section-shell overflow-hidden rounded-[32px] border border-[var(--color-stone-200)] bg-[var(--color-stone-100)] shadow-[var(--shadow-soft)]">
              <img
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          </section>
        ) : null}

        <section className="bg-white px-4 py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <BlogBlocks blocks={post.content} />

              {sourceOriginalUrl ? (
                <div className="mt-8 rounded-[28px] border border-[var(--color-stone-200)] bg-[var(--color-stone-100)] p-5 text-sm leading-7 text-[var(--color-stone-600)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-700)]">
                    Источник материала
                  </div>
                  <p className="mt-3">
                    Статья подготовлена на основе публикации автора на B17 и адаптирована для блога сайта.
                  </p>
                  <a
                    href={sourceOriginalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-medium text-[var(--color-sage-700)] underline underline-offset-4"
                  >
                    Открыть оригинал на B17
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ) : null}

              <div className="mt-10 rounded-[32px] border border-[var(--color-sage-200)] bg-[var(--color-sage-100)] p-6 md:p-8">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-700)]">
                  Следующий шаг
                </div>
                <h2 className="mt-4 font-serif text-3xl text-[var(--color-stone-800)]">
                  {primaryCta.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[var(--color-stone-600)]">
                  {primaryCta.description}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={primaryCta.href} className="btn-primary">
                    {primaryCta.label}
                  </Link>
                  <Link href="/services" className="btn-secondary">
                    Посмотреть направления помощи
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-[32px] border border-[var(--color-stone-200)] bg-[var(--color-cream-100)] p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-600)]">
                      Автор статьи
                    </div>
                    <div className="font-serif text-3xl text-[var(--color-stone-800)]">
                      {authorName}
                    </div>
                    <p className="text-[var(--color-stone-600)]">
                      {authorTitle}
                      {authorExperience ? ` • опыт ${authorExperience}` : ''}
                      {authorCity ? ` • ${authorCity}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/about" className="btn-secondary">
                      Узнать о специалисте
                    </Link>
                    <Link href="/contact" className="btn-primary">
                      Записаться
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {relatedServices.length > 0 ? (
                <div className="rounded-[28px] border border-[var(--color-stone-200)] bg-[var(--color-cream-100)] p-6">
                  <h2 className="font-serif text-2xl text-[var(--color-stone-800)]">
                    С чем это можно обсудить
                  </h2>
                  <div className="mt-4 space-y-3">
                    {relatedServices.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href}
                        className="block rounded-2xl border border-[var(--color-stone-200)] bg-white p-4 transition-colors hover:border-[var(--color-sage-300)]"
                      >
                        <div className="font-medium text-[var(--color-stone-800)]">{service.title}</div>
                        <div className="mt-1 text-sm leading-6 text-[var(--color-stone-500)]">
                          {service.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedPages.length > 0 ? (
                <div className="panel-strong p-6">
                  <h2 className="font-serif text-2xl text-[var(--color-stone-800)]">
                    Вас может заинтересовать
                  </h2>
                  <div className="mt-4 space-y-3">
                    {relatedPages.map((page) => (
                      <Link
                        key={page.key}
                        href={page.href}
                        className="block rounded-2xl bg-[var(--color-stone-100)] p-4 transition-colors hover:bg-[var(--color-stone-200)]"
                      >
                        <div className="font-medium text-[var(--color-stone-800)]">{page.title}</div>
                        <div className="mt-1 text-sm leading-6 text-[var(--color-stone-500)]">
                          {page.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="panel-dark p-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                  Быстрый CTA
                </div>
                <h2 className="mt-4 font-serif text-3xl text-white">
                  Обсудить ваш запрос лично
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-stone-300)]">
                  Если хотите перейти от чтения к живому разговору, можно выбрать удобный способ связи прямо сейчас.
                </p>
                <div className="mt-6 space-y-3">
                  <Link href="/contact" className="btn-primary w-full !bg-white !text-[var(--color-sage-800)]">
                    Записаться на консультацию
                  </Link>
                  <Link href="/pricing" className="btn-secondary w-full !border-white/30 !text-white hover:!bg-white/10">
                    Посмотреть стоимость
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="bg-[var(--color-cream-100)] px-4 py-16">
            <div className="section-shell">
              <div className="mb-8 max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sage-600)]">
                  Читайте также
                </div>
                <h2 className="mt-4 font-serif text-4xl text-[var(--color-stone-800)]">
                  Похожие статьи по теме
                </h2>
                <p className="mt-3 text-[var(--color-stone-500)]">
                  Эти материалы помогут посмотреть на тему шире и перейти к следующему полезному шагу.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <CTASection
        title="Чтение помогло лучше понять себя?"
        subtitle="На консультации можно перейти от общей информации к вашей личной ситуации и выбрать понятный путь дальше."
      />
    </>
  )
}
