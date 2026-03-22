import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTASection } from '@/components/sections/CTASection'
import { generatePageMetadata } from '@/lib/metadata'
import type { BlogPost } from '@/types'

// Демо-данные — в продакшн замените на загрузку из CMS/файловой системы
const POSTS: Record<string, BlogPost & { content: string }> = {
  'chto-takoe-trevoga': {
    slug: 'chto-takoe-trevoga',
    title: 'Что такое тревога и почему она появляется',
    excerpt: 'Тревога — это нормальная реакция психики на угрозу. Но когда она становится хронической, она перестаёт помогать и начинает мешать.',
    date: '10 марта 2026',
    readTime: '6 мин',
    category: 'Тревога',
    content: `
      <p>Тревога — это сигнал. Эволюционно она возникала, чтобы предупредить нас об опасности: заставить убежать от хищника или лучше подготовиться к сложной ситуации. В этом смысле тревога — наш союзник.</p>

      <h2>Когда тревога становится проблемой?</h2>

      <p>Проблема начинается тогда, когда сигнализация срабатывает постоянно — даже в отсутствие реальной угрозы. Когда вы тревожитесь о том, что не случилось, и, возможно, никогда не случится. Когда тревога мешает жить: принимать решения, общаться, работать, отдыхать.</p>

      <p>Хроническая тревога — это не слабость характера. Это состояние, которое формируется под влиянием многих факторов: наследственности, раннего опыта, длительного стресса, привычки катастрофизировать.</p>

      <h2>Как работает тревожный цикл?</h2>

      <p>Большинство тревожных реакций работают по замкнутому кругу: тревожная мысль → физическое напряжение → поведение избегания → временное облегчение → новая тревожная мысль.</p>

      <p>Когда мы избегаем того, что тревожит — например, не звоним по важному делу или не идём на вечеринку — тревога на короткое время снижается. Но долгосрочно это только укрепляет убеждение, что ситуация опасна.</p>

      <h2>Что можно сделать?</h2>

      <p>Хорошая новость: с тревогой можно работать. Психологические методы, в первую очередь когнитивно-поведенческая терапия, дают хорошие результаты. Работа направлена на то, чтобы научиться замечать тревожные мысли, проверять их на реалистичность и постепенно расширять зону комфорта.</p>

      <p>Если тревога мешает вам жить — это достаточная причина обратиться за помощью. Ждать "настоящего кризиса" не нужно.</p>
    `,
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return { title: 'Статья не найдена' }
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    notFound()
  }

  // Schema.org для статьи (SEO)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Анна Соколова',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Анна Соколова — психолог',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        {/* HERO */}
        <header className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />

          <div className="max-w-3xl mx-auto relative z-10">
            <Breadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: 'Блог', href: '/blog' },
                { label: post.title },
              ]}
              className="mb-8"
            />
            
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
                <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full" />
                <span>{post.category}</span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-stone-800)] leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-stone-500)]">
                <span className="font-medium">{post.date}</span>
                <span className="text-[var(--color-stone-300)]">·</span>
                <span>{post.readTime} чтения</span>
                <span className="text-[var(--color-stone-300)]">·</span>
                <span>Анна Соколова</span>
              </div>
            </div>
          </div>
        </header>

        {/* КОНТЕНТ */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose-content text-[var(--color-stone-600)] leading-relaxed space-y-6 text-base [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-[var(--color-stone-800)] [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Подпись автора */}
            <div className="mt-16 pt-8 border-t border-[var(--color-stone-200)] flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-cream-200)] flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-[var(--color-stone-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[var(--color-stone-800)]">Анна Соколова</div>
                <div className="text-sm text-[var(--color-stone-400)]">
                  Психолог-консультант · 9 лет практики
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* CTA */}
      <CTASection
        title="Статья оказалась близкой?"
        subtitle="Если хотите разобраться с этим глубже — я здесь."
      />

      {/* Назад к блогу */}
      <section className="py-12 px-4 bg-white text-center">
        <Link
          href="/blog"
          className="text-[var(--color-sage-600)] hover:text-[var(--color-sage-800)] font-medium text-sm underline underline-offset-4 transition-colors"
        >
          ← Все статьи
        </Link>
      </section>
    </>
  )
}
