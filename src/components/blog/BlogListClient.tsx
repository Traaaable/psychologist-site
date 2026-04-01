'use client'

import { useDeferredValue, useEffect, useState } from 'react'
import { BlogCard } from '@/components/blog/BlogCard'
import type { BlogPost } from '@/lib/blog-schema'

interface BlogListClientProps {
  posts: BlogPost[]
  categories: string[]
  tags: string[]
}

const PAGE_SIZE = 6

export function BlogListClient({ posts, categories, tags }: BlogListClientProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState('')
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    setPage(1)
  }, [deferredQuery, activeCategory, activeTag])

  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      !normalizedQuery ||
      [post.title, post.excerpt, post.category, post.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesCategory =
      activeCategory === 'all' || post.category === activeCategory

    const matchesTag = !activeTag || post.tags.includes(activeTag)

    return matchesQuery && matchesCategory && matchesTag
  })

  const featuredPosts =
    !normalizedQuery && activeCategory === 'all' && !activeTag
      ? filteredPosts.filter((post) => post.isFeatured).slice(0, 2)
      : []

  const feedPosts =
    featuredPosts.length > 0
      ? filteredPosts.filter((post) => !featuredPosts.some((featuredPost) => featuredPost.id === post.id))
      : filteredPosts

  const paginatedPosts = feedPosts.slice(0, page * PAGE_SIZE)
  const hasMore = paginatedPosts.length < feedPosts.length

  return (
    <div className="space-y-10">
      <section className="panel-strong p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]">
                Поиск по блогу
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например: тревога, отношения, выгорание"
                className="input-field"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[var(--color-sage-700)] text-white'
                    : 'bg-[var(--color-cream-50)] text-[var(--color-stone-600)] hover:bg-white'
                }`}
              >
                Все темы
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    activeCategory === category
                      ? 'bg-[var(--color-sage-700)] text-white'
                      : 'bg-[var(--color-cream-50)] text-[var(--color-stone-600)] hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {tags.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-[var(--color-stone-700)]">Популярные теги</div>
              <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTag('')}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    !activeTag
                      ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-100)] text-[var(--color-sage-700)]'
                      : 'border-[var(--color-stone-200)] bg-white/80 text-[var(--color-stone-500)] hover:border-[var(--color-stone-300)]'
                  }`}
                >
                  Все
                </button>
                {tags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      activeTag === tag
                        ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-100)] text-[var(--color-sage-700)]'
                        : 'border-[var(--color-stone-200)] bg-white/80 text-[var(--color-stone-500)] hover:border-[var(--color-stone-300)]'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {featuredPosts.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl text-[var(--color-stone-800)]">
                Рекомендуемые статьи
              </h2>
              <p className="mt-2 text-[var(--color-stone-500)]">
                Материалы, с которых удобно начать знакомство с блогом.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {feedPosts.length > 0 ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-3xl text-[var(--color-stone-800)]">
                Все статьи
              </h2>
              <p className="mt-2 text-[var(--color-stone-500)]">
                Найдено материалов: {filteredPosts.length}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="btn-secondary"
              >
                Показать еще
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="panel-strong border-dashed px-6 py-12 text-center">
          <h2 className="font-serif text-3xl text-[var(--color-stone-800)]">
            Пока ничего не найдено
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-stone-500)]">
            Попробуйте изменить запрос, выбрать другую тему или вернуться ко всем статьям.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveCategory('all')
                setActiveTag('')
              }}
              className="btn-secondary"
            >
              Сбросить фильтры
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
