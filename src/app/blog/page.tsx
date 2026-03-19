import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Блог — статьи о психологии',
  description:
    'Статьи о психологии, тревоге, выгорании, отношениях и самопознании. Простым языком о том, как работает наша психика.',
  path: '/blog',
})

// Типы для блог-постов — расширяйте по мере роста
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image?: string
}

// В будущем — замените на загрузку из CMS/файлов
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
      'Внутренний критик есть у всех. Но одно дело — полезная критика, помогающая расти. Другое — разрушительный самозапрёт, от которого становится только хуже.',
    date: '21 февраля 2026',
    readTime: '5 мин',
    category: 'Самооценка',
  },
]

export default function BlogPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-cream-100)] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Блог' }]}
            className="mb-8"
          />
          <div className="max-w-3xl">
            <span className="badge badge-sage mb-5 inline-block">Блог</span>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-stone-800)] leading-tight mb-6">
              Статьи о психологии
            </h1>
            <p className="text-xl text-[var(--color-stone-500)] leading-relaxed">
              Пишу о том, как работает наша психика — просто, честно и без лишних терминов.
            </p>
          </div>
        </div>
      </section>

      {/* СТАТЬИ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-soft p-7 group block flex flex-col"
              >
                {/* Категория */}
                <div className="badge badge-sage mb-4 self-start">{post.category}</div>

                {/* Заголовок */}
                <h2 className="font-serif text-xl text-[var(--color-stone-800)] mb-3 leading-snug group-hover:text-[var(--color-sage-700)] transition-colors duration-200">
                  {post.title}
                </h2>

                {/* Анонс */}
                <p className="text-sm text-[var(--color-stone-500)] leading-relaxed flex-1 mb-5">
                  {post.excerpt}
                </p>

                {/* Мета */}
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
