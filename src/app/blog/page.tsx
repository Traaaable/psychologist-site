import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Блог — статьи о психологии',
    description:
      'Статьи о психологии, тревоге, выгорании, отношениях и самопознании. Простым языком о том, как работает наша психика.',
    path: '/blog',
  })
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image?: string
}

const DEMO_POSTS: BlogPost[] = [
  {
    slug: 'chto-takoe-trevoga',
    title: 'Что такое тревога и почему она появляется',
    excerpt:
      'Тревога — это нормальная реакция психики на угрозу. Но когда она становится хронической, она перестаёт помогать и начинает мешать. Разбираем, как это работает.',
    date: '10 марта 2026',
    readTime: '6 мин',
    category: 'Тревога',
  },
  {
    slug: 'vygoranie-kak-ne-dopustit',
    title: 'Выгорание: как распознать и что делать',
    excerpt:
      'Выгорание — это не слабость и не лень. Это истощение ресурсов, которое накапливается постепенно. Рассказываю, на что обращать внимание и как начать восстанавливаться.',
    date: '3 марта 2026',
    readTime: '8 мин',
    category: 'Выгорание',
  },
  {
    slug: 'kak-rabotat-s-samokritikoi',
    title: 'Как работать с самокритикой',
    excerpt:
      'Внутренний критик есть у всех. Но одно дело — полезная критика, помогающая расти. Другое — разрушительный самозапрет, от которого становится только хуже.',
    date: '21 февраля 2026',
    readTime: '5 мин',
    category: 'Самооценка',
  },
]

export default function BlogPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-cream-100)] px-4 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-sage-500)] opacity-[0.04] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Блог' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)]"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-sage-600)]">
                Материалы и заметки
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-sage-200)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--color-sage-700)] shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-500)]" />
              <span>Блог</span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[var(--color-stone-800)] md:text-6xl lg:text-7xl">
              Статьи о психологии
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-stone-500)] md:text-xl">
              Пишу о том, как работает наша психика, что помогает переживать сложные периоды и
              почему забота о себе не начинается с идеальности.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-soft block p-7 group flex flex-col"
              >
                <div className="badge badge-sage mb-4 self-start">{post.category}</div>

                <h2 className="mb-3 font-serif text-xl leading-snug text-[var(--color-stone-800)] transition-colors duration-200 group-hover:text-[var(--color-sage-700)]">
                  {post.title}
                </h2>

                <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-stone-500)]">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--color-stone-400)]">
                  <span>{post.date}</span>
                  <span>{post.readTime} чтения</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
