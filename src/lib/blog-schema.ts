export type BlogPostStatus = 'draft' | 'published'
export type BlogHeadingLevel = 2 | 3
export type BlogListStyle = 'unordered' | 'ordered'
export type SitePageKey =
  | 'home'
  | 'about'
  | 'services'
  | 'how-it-works'
  | 'pricing'
  | 'contact'

export interface BlogParagraphBlock {
  id: string
  type: 'paragraph'
  text: string
}

export interface BlogHeadingBlock {
  id: string
  type: 'heading'
  text: string
  level: BlogHeadingLevel
}

export interface BlogListBlock {
  id: string
  type: 'list'
  style: BlogListStyle
  items: string[]
}

export interface BlogQuoteBlock {
  id: string
  type: 'quote'
  text: string
  author?: string
}

export interface BlogImageBlock {
  id: string
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export type BlogContentBlock =
  | BlogParagraphBlock
  | BlogHeadingBlock
  | BlogListBlock
  | BlogQuoteBlock
  | BlogImageBlock

export interface BlogPostCta {
  title: string
  description: string
  label: string
  href: string
}

export interface BlogPostSeo {
  title: string
  description: string
}

export interface BlogPost {
  id: string
  slug: string
  status: BlogPostStatus
  title: string
  excerpt: string
  coverImage?: string
  coverAlt?: string
  category: string
  tags: string[]
  publishedAt?: string
  updatedAt?: string
  seo: BlogPostSeo
  serviceIds: string[]
  relatedPageKeys: SitePageKey[]
  relatedPostIds: string[]
  isFeatured: boolean
  cta: BlogPostCta
  content: BlogContentBlock[]
}

export interface BlogSection {
  heading: string
  description: string
  posts: BlogPost[]
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'cz',
  ч: 'ch',
  ш: 'sh',
  щ: 'shh',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function createBlockId(type: BlogContentBlock['type']) {
  return randomId(type)
}

export function createPostId() {
  return randomId('post')
}

export function slugify(value: string) {
  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join('')

  const normalized = transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'statya'
}

export function ensureUniqueSlug(
  posts: Pick<BlogPost, 'id' | 'slug'>[],
  rawValue: string,
  currentId?: string
) {
  const baseSlug = slugify(rawValue)
  let candidate = baseSlug
  let counter = 2

  while (
    posts.some(
      (post) => post.id !== currentId && post.slug.trim().toLowerCase() === candidate
    )
  ) {
    candidate = `${baseSlug}-${counter}`
    counter += 1
  }

  return candidate
}

function ensureString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function ensureStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => ensureString(item).trim())
    .filter(Boolean)
}

function normalizeDate(value: unknown) {
  const raw = ensureString(value).trim()

  if (!raw) {
    return undefined
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

function normalizeHeadingLevel(value: unknown): BlogHeadingLevel {
  return value === 3 ? 3 : 2
}

function normalizeListStyle(value: unknown): BlogListStyle {
  return value === 'ordered' ? 'ordered' : 'unordered'
}

export function createEmptyPost(): BlogPost {
  return {
    id: createPostId(),
    slug: '',
    status: 'draft',
    title: '',
    excerpt: '',
    category: '',
    tags: [],
    seo: {
      title: '',
      description: '',
    },
    serviceIds: [],
    relatedPageKeys: [],
    relatedPostIds: [],
    isFeatured: false,
    cta: {
      title: 'Если тема откликается, это можно обсудить на консультации',
      description:
        'На встрече спокойно разберем вашу ситуацию и подберем понятный следующий шаг.',
      label: 'Записаться на консультацию',
      href: '/contact',
    },
    content: [
      {
        id: createBlockId('paragraph'),
        type: 'paragraph',
        text: '',
      },
    ],
  }
}

export function createEmptyBlogSection(): BlogSection {
  return {
    heading: '',
    description: '',
    posts: [],
  }
}

export function normalizeBlogBlock(input: unknown): BlogContentBlock {
  const source = (input ?? {}) as Record<string, unknown>
  const type = source.type

  if (type === 'heading') {
    return {
      id: ensureString(source.id) || createBlockId('heading'),
      type: 'heading',
      text: ensureString(source.text),
      level: normalizeHeadingLevel(source.level),
    }
  }

  if (type === 'list') {
    return {
      id: ensureString(source.id) || createBlockId('list'),
      type: 'list',
      style: normalizeListStyle(source.style),
      items: ensureStringArray(source.items),
    }
  }

  if (type === 'quote') {
    return {
      id: ensureString(source.id) || createBlockId('quote'),
      type: 'quote',
      text: ensureString(source.text),
      author: ensureString(source.author) || undefined,
    }
  }

  if (type === 'image') {
    return {
      id: ensureString(source.id) || createBlockId('image'),
      type: 'image',
      src: ensureString(source.src),
      alt: ensureString(source.alt),
      caption: ensureString(source.caption) || undefined,
    }
  }

  return {
    id: ensureString(source.id) || createBlockId('paragraph'),
    type: 'paragraph',
    text: ensureString(source.text),
  }
}

export function normalizeBlogPost(
  input: unknown,
  posts: Pick<BlogPost, 'id' | 'slug'>[] = []
): BlogPost {
  const source = (input ?? {}) as Record<string, unknown>
  const fallback = createEmptyPost()
  const id = ensureString(source.id) || fallback.id
  const title = ensureString(source.title)
  const slug = ensureUniqueSlug(
    posts,
    ensureString(source.slug) || title || fallback.id,
    id
  )
  const content = Array.isArray(source.content)
    ? source.content.map((block) => normalizeBlogBlock(block))
    : fallback.content

  return {
    id,
    slug,
    status: source.status === 'published' ? 'published' : 'draft',
    title,
    excerpt: ensureString(source.excerpt),
    coverImage: ensureString(source.coverImage) || undefined,
    coverAlt: ensureString(source.coverAlt) || undefined,
    category: ensureString(source.category),
    tags: ensureStringArray(source.tags),
    publishedAt: normalizeDate(source.publishedAt),
    updatedAt: normalizeDate(source.updatedAt),
    seo: {
      title:
        ensureString((source.seo as Record<string, unknown> | undefined)?.title),
      description:
        ensureString((source.seo as Record<string, unknown> | undefined)?.description),
    },
    serviceIds: ensureStringArray(source.serviceIds),
    relatedPageKeys: ensureStringArray(source.relatedPageKeys).filter(
      (key): key is SitePageKey =>
        ['home', 'about', 'services', 'how-it-works', 'pricing', 'contact'].includes(key)
    ),
    relatedPostIds: ensureStringArray(source.relatedPostIds),
    isFeatured: Boolean(source.isFeatured),
    cta: {
      title:
        ensureString((source.cta as Record<string, unknown> | undefined)?.title) ||
        fallback.cta.title,
      description:
        ensureString((source.cta as Record<string, unknown> | undefined)?.description) ||
        fallback.cta.description,
      label:
        ensureString((source.cta as Record<string, unknown> | undefined)?.label) ||
        fallback.cta.label,
      href:
        ensureString((source.cta as Record<string, unknown> | undefined)?.href) ||
        fallback.cta.href,
    },
    content,
  }
}

export function normalizeBlogSection(input: unknown): BlogSection {
  const source = (input ?? {}) as Record<string, unknown>
  const rawPosts = Array.isArray(source.posts) ? source.posts : []
  const normalizedPosts: BlogPost[] = []

  for (const rawPost of rawPosts) {
    normalizedPosts.push(
      normalizeBlogPost(rawPost, normalizedPosts.map((post) => ({ id: post.id, slug: post.slug })))
    )
  }

  return {
    heading: ensureString(source.heading),
    description: ensureString(source.description),
    posts: normalizedPosts,
  }
}

export function collectBlockText(block: BlogContentBlock) {
  if (block.type === 'list') {
    return block.items.join(' ')
  }

  if (block.type === 'image') {
    return [block.alt, block.caption].filter(Boolean).join(' ')
  }

  if (block.type === 'quote') {
    return [block.text, block.author].filter(Boolean).join(' ')
  }

  return block.text
}

export function getPostPlainText(post: Pick<BlogPost, 'title' | 'excerpt' | 'content'>) {
  return [post.title, post.excerpt, ...post.content.map((block) => collectBlockText(block))]
    .filter(Boolean)
    .join(' ')
}

export function estimateReadTime(post: Pick<BlogPost, 'title' | 'excerpt' | 'content'>) {
  const plainText = getPostPlainText(post)
  const words = plainText
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 180))
}
