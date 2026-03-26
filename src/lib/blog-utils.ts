import { estimateReadTime, type BlogPost, type SitePageKey } from '@/lib/blog-schema'

export interface SitePageLink {
  key: SitePageKey
  href: string
  title: string
  description: string
}

export const SITE_PAGE_LINKS: SitePageLink[] = [
  {
    key: 'home',
    href: '/',
    title: 'Главная',
    description: 'Кратко о подходе, формате работы и направлениях помощи.',
  },
  {
    key: 'about',
    href: '/about',
    title: 'Обо мне',
    description: 'Опыт, образование, подход и ценности специалиста.',
  },
  {
    key: 'services',
    href: '/services',
    title: 'С чем я работаю',
    description: 'Темы, с которыми можно обратиться на консультацию.',
  },
  {
    key: 'how-it-works',
    href: '/how-it-works',
    title: 'Как проходят консультации',
    description: 'Понятно о процессе, формате и первых шагах.',
  },
  {
    key: 'pricing',
    href: '/pricing',
    title: 'Стоимость',
    description: 'Цены, длительность встреч и форматы консультаций.',
  },
  {
    key: 'contact',
    href: '/contact',
    title: 'Записаться',
    description: 'Контакты, форма связи и быстрый способ договориться о встрече.',
  },
]

export function formatBlogDate(date?: string) {
  if (!date) {
    return ''
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export function getBlogReadTime(post: Pick<BlogPost, 'title' | 'excerpt' | 'content'>) {
  const minutes = estimateReadTime(post)
  return `${minutes} мин`
}
