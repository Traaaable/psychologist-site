export type BlogPostStatus = 'draft' | 'review' | 'published'
export type BlogHeadingLevel = 2 | 3
export type BlogListStyle = 'unordered' | 'ordered'
export type BlogImportSource = 'b17'
export type BlogImportStatus =
  | 'imported'
  | 'updated'
  | 'needs_review'
  | 'partial'
  | 'error'
  | 'skipped'
export type BlogImportRunStatus = 'success' | 'partial' | 'error'
export type BlogImportRunKind = 'sync' | 'manual-url' | 'reimport'
export type B17PublicationType = 'article' | 'blog'
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

export interface BlogDividerBlock {
  id: string
  type: 'divider'
}

export interface BlogHtmlBlock {
  id: string
  type: 'html'
  html: string
}

export type BlogContentBlock =
  | BlogParagraphBlock
  | BlogHeadingBlock
  | BlogListBlock
  | BlogQuoteBlock
  | BlogImageBlock
  | BlogDividerBlock
  | BlogHtmlBlock

export interface BlogPostCta {
  title: string
  description: string
  label: string
  href: string
}

export interface BlogPostSeo {
  title: string
  description: string
  canonicalUrl?: string
}

export interface BlogPostSourceMeta {
  source: BlogImportSource
  sourceType?: B17PublicationType
  originalUrl: string
  originalId?: string
  originalPublishedAt?: string
  importedAt?: string
  lastCheckedAt?: string
  importStatus: BlogImportStatus
  lastImportError?: string
  sourceTitle?: string
  sourceExcerpt?: string
  sourceCoverImage?: string
  sourceHtml?: string
  autoUpdate: boolean
}

export interface B17ImportSettings {
  enabled: boolean
  authorSlug: string
  authorProfileUrl: string
  authorPublicationsUrl: string
  includeTypes: B17PublicationType[]
  maxPagesPerSync: number
  autoUpdateImportedPosts: boolean
}

export interface BlogImportRunError {
  code?: string
  message: string
  articleUrl?: string
  articleTitle?: string
  createdAt: string
}

export interface BlogImportRunStats {
  scanned: number
  imported: number
  updated: number
  skipped: number
  failed: number
}

export interface BlogImportRun {
  id: string
  source: BlogImportSource
  kind: BlogImportRunKind
  startedAt: string
  finishedAt?: string
  status: BlogImportRunStatus
  message?: string
  stats: BlogImportRunStats
  errors: BlogImportRunError[]
}

export interface BlogImportsState {
  b17: B17ImportSettings
  lastRun?: BlogImportRun
  runs: BlogImportRun[]
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
  sourceMeta?: BlogPostSourceMeta
}

export interface BlogSection {
  heading: string
  description: string
  posts: BlogPost[]
  imports: BlogImportsState
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

export function createImportRunId() {
  return randomId('import-run')
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

function ensureRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

function normalizeHeadingLevel(value: unknown): BlogHeadingLevel {
  return value === 3 ? 3 : 2
}

function normalizeListStyle(value: unknown): BlogListStyle {
  return value === 'ordered' ? 'ordered' : 'unordered'
}

function normalizePostStatus(value: unknown): BlogPostStatus {
  if (value === 'published') {
    return 'published'
  }

  if (value === 'review') {
    return 'review'
  }

  return 'draft'
}

function normalizeImportStatus(value: unknown): BlogImportStatus {
  switch (value) {
    case 'updated':
    case 'needs_review':
    case 'partial':
    case 'error':
    case 'skipped':
      return value
    default:
      return 'imported'
  }
}

function normalizeImportRunStatus(value: unknown): BlogImportRunStatus {
  if (value === 'partial') {
    return 'partial'
  }

  if (value === 'error') {
    return 'error'
  }

  return 'success'
}

function normalizeImportRunKind(value: unknown): BlogImportRunKind {
  if (value === 'manual-url') {
    return 'manual-url'
  }

  if (value === 'reimport') {
    return 'reimport'
  }

  return 'sync'
}

function normalizePublicationType(value: unknown): B17PublicationType | undefined {
  if (value === 'blog') {
    return 'blog'
  }

  if (value === 'article') {
    return 'article'
  }

  return undefined
}

function normalizePublicationTypes(value: unknown): B17PublicationType[] {
  const source = ensureStringArray(value)
  const types = source
    .map((item) => normalizePublicationType(item))
    .filter((item): item is B17PublicationType => Boolean(item))

  return types.length > 0 ? [...new Set(types)] : ['article', 'blog']
}

function normalizeImportRunStats(value: unknown): BlogImportRunStats {
  const source = ensureRecord(value)

  return {
    scanned: Number(source.scanned) || 0,
    imported: Number(source.imported) || 0,
    updated: Number(source.updated) || 0,
    skipped: Number(source.skipped) || 0,
    failed: Number(source.failed) || 0,
  }
}

export function createEmptyImportRunStats(): BlogImportRunStats {
  return {
    scanned: 0,
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  }
}

export function createDefaultB17ImportSettings(): B17ImportSettings {
  const authorSlug = 'nesterova'

  return {
    enabled: true,
    authorSlug,
    authorProfileUrl: `https://www.b17.ru/${authorSlug}/`,
    authorPublicationsUrl: `https://www.b17.ru/articles/${authorSlug}/`,
    includeTypes: ['article', 'blog'],
    maxPagesPerSync: 3,
    autoUpdateImportedPosts: false,
  }
}

export function createEmptyBlogImports(): BlogImportsState {
  return {
    b17: createDefaultB17ImportSettings(),
    runs: [],
  }
}

function normalizeImportRunError(input: unknown): BlogImportRunError {
  const source = ensureRecord(input)

  return {
    code: ensureString(source.code) || undefined,
    message: ensureString(source.message),
    articleUrl: ensureString(source.articleUrl) || undefined,
    articleTitle: ensureString(source.articleTitle) || undefined,
    createdAt: normalizeDate(source.createdAt) || new Date().toISOString(),
  }
}

function normalizeImportRun(input: unknown): BlogImportRun {
  const source = ensureRecord(input)

  return {
    id: ensureString(source.id) || createImportRunId(),
    source: 'b17',
    kind: normalizeImportRunKind(source.kind),
    startedAt: normalizeDate(source.startedAt) || new Date().toISOString(),
    finishedAt: normalizeDate(source.finishedAt),
    status: normalizeImportRunStatus(source.status),
    message: ensureString(source.message) || undefined,
    stats: normalizeImportRunStats(source.stats),
    errors: Array.isArray(source.errors)
      ? source.errors.map((error) => normalizeImportRunError(error))
      : [],
  }
}

function normalizeB17ImportSettings(input: unknown): B17ImportSettings {
  const fallback = createDefaultB17ImportSettings()
  const source = ensureRecord(input)
  const authorSlug = ensureString(source.authorSlug) || fallback.authorSlug

  return {
    enabled: source.enabled === false ? false : true,
    authorSlug,
    authorProfileUrl:
      ensureString(source.authorProfileUrl) ||
      `https://www.b17.ru/${authorSlug}/`,
    authorPublicationsUrl:
      ensureString(source.authorPublicationsUrl) ||
      `https://www.b17.ru/articles/${authorSlug}/`,
    includeTypes: normalizePublicationTypes(source.includeTypes),
    maxPagesPerSync: Math.max(1, Math.min(50, Number(source.maxPagesPerSync) || fallback.maxPagesPerSync)),
    autoUpdateImportedPosts: Boolean(source.autoUpdateImportedPosts),
  }
}

export function normalizeBlogImportsState(input: unknown): BlogImportsState {
  const source = ensureRecord(input)
  const runs = Array.isArray(source.runs)
    ? source.runs.map((run) => normalizeImportRun(run)).slice(0, 20)
    : []

  return {
    b17: normalizeB17ImportSettings(source.b17),
    lastRun: source.lastRun ? normalizeImportRun(source.lastRun) : runs[0],
    runs,
  }
}

function normalizePostSourceMeta(input: unknown): BlogPostSourceMeta | undefined {
  const source = ensureRecord(input)
  const originalUrl = ensureString(source.originalUrl)

  if (!originalUrl) {
    return undefined
  }

  return {
    source: 'b17',
    sourceType: normalizePublicationType(source.sourceType),
    originalUrl,
    originalId: ensureString(source.originalId) || undefined,
    originalPublishedAt: normalizeDate(source.originalPublishedAt),
    importedAt: normalizeDate(source.importedAt),
    lastCheckedAt: normalizeDate(source.lastCheckedAt),
    importStatus: normalizeImportStatus(source.importStatus),
    lastImportError: ensureString(source.lastImportError) || undefined,
    sourceTitle: ensureString(source.sourceTitle) || undefined,
    sourceExcerpt: ensureString(source.sourceExcerpt) || undefined,
    sourceCoverImage: ensureString(source.sourceCoverImage) || undefined,
    sourceHtml: ensureString(source.sourceHtml) || undefined,
    autoUpdate: source.autoUpdate === false ? false : true,
  }
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
      canonicalUrl: '',
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
    imports: createEmptyBlogImports(),
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

  if (type === 'divider') {
    return {
      id: ensureString(source.id) || createBlockId('divider'),
      type: 'divider',
    }
  }

  if (type === 'html') {
    return {
      id: ensureString(source.id) || createBlockId('html'),
      type: 'html',
      html: ensureString(source.html),
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
    status: normalizePostStatus(source.status),
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
      canonicalUrl:
        ensureString((source.seo as Record<string, unknown> | undefined)?.canonicalUrl) ||
        undefined,
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
    sourceMeta: normalizePostSourceMeta(source.sourceMeta),
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
    imports: normalizeBlogImportsState(source.imports),
  }
}

export function collectBlockText(block: BlogContentBlock) {
  if (block.type === 'list') {
    return block.items.join(' ')
  }

  if (block.type === 'image') {
    return [block.alt, block.caption].filter(Boolean).join(' ')
  }

  if (block.type === 'html') {
    return block.html.replace(/<[^>]+>/g, ' ')
  }

  if (block.type === 'quote') {
    return [block.text, block.author].filter(Boolean).join(' ')
  }

  if (block.type === 'divider') {
    return ''
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
