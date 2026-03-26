import { load } from 'cheerio'
import { convertHtmlToBlocks } from '@/lib/blog-import/html-to-blocks'
import { storeB17Image } from '@/lib/blog-import/image-storage'
import type { ExternalArticleListItem, ExternalArticlePayload, ExternalListResult } from '@/lib/blog-import/types'
import {
  ExternalImportError,
  fetchExternalHtml,
  normalizeAbsoluteUrl,
  normalizeWhitespace,
  parseB17Date,
  truncateText,
} from '@/lib/blog-import/shared'

function detectPublicationType(url: string) {
  const pathname = new URL(url).pathname

  if (pathname.startsWith('/blog/')) {
    return 'blog' as const
  }

  if (pathname.startsWith('/article/')) {
    return 'article' as const
  }

  return undefined
}

function extractOriginalId(url: string) {
  const match = new URL(url).pathname.match(/^\/(?:article|blog)\/(\d+)\/?$/)
  return match?.[1]
}

function parseListingMeta(metaText: string) {
  const normalized = normalizeWhitespace(metaText)
  const inlineMatch = normalized.match(/^(Статья|Заметка)\s*\|\s*(.+)$/i)

  if (inlineMatch) {
    return {
      sourceType: inlineMatch[1].toLowerCase().includes('заметка') ? 'blog' : 'article',
      dateLabel: inlineMatch[2],
    } as const
  }

  const bracketMatch = normalized.match(/^(.+?)\s*\((Статья|Заметка)\)$/i)

  if (bracketMatch) {
    return {
      sourceType: bracketMatch[2].toLowerCase().includes('заметка') ? 'blog' : 'article',
      dateLabel: bracketMatch[1],
    } as const
  }

  return undefined
}

function parseListItem(elementHtml: string, pageUrl: string): ExternalArticleListItem | null {
  const $ = load(elementHtml)
  const root = $.root()
  const link = root.find('.m a.h').first()
  const href = normalizeAbsoluteUrl(link.attr('href') || '', pageUrl)
  const sourceType = href ? detectPublicationType(href) : undefined

  if (!href || !sourceType) {
    return null
  }

  const cover = root.find('.f img').first()
  const coverImage = normalizeAbsoluteUrl(
    cover.attr('src') || cover.attr('src_defer') || '',
    pageUrl
  )
  const title = normalizeWhitespace(link.text())
  const excerpt = truncateText(root.find('.t').first().text(), 260)
  const metaText =
    normalizeWhitespace(root.find('.u .ul').first().text()) ||
    normalizeWhitespace(root.find('.s').first().text())
  const meta = parseListingMeta(metaText)
  const tags = root
    .find('.tag_list a, .tag_list2 a')
    .map((_, item) => normalizeWhitespace($(item).text()))
    .get()
    .filter(Boolean)

  return {
    source: 'b17',
    sourceType: meta?.sourceType || sourceType,
    title,
    url: href,
    originalId: extractOriginalId(href),
    originalPublishedAt: meta?.dateLabel ? parseB17Date(meta.dateLabel) : undefined,
    dateLabel: meta?.dateLabel,
    excerpt,
    coverImage: coverImage || undefined,
    coverAlt: title,
    isPinned: root.find('.ico_svg[title="Закреплена"]').length > 0,
    tags,
  } satisfies ExternalArticleListItem
}

function parseItemsFromAuthorPage(html: string, pageUrl: string) {
  const $ = load(html)

  return $('#art_list_main .master_tre_list')
    .map((_, element) => parseListItem($.html(element), pageUrl))
    .get()
    .filter(Boolean) as ExternalArticleListItem[]
}

function parseItemsFromProfilePage(html: string, pageUrl: string) {
  const $ = load(html)

  return $('#article .master_tre_list')
    .map((_, element) => parseListItem($.html(element), pageUrl))
    .get()
    .filter(Boolean) as ExternalArticleListItem[]
}

function parseAuthorPageCount(html: string) {
  const $ = load(html)
  const pages = $('.page-list a[href*="?page="]')
    .map((_, link) => Number(new URL(normalizeAbsoluteUrl($(link).attr('href') || '', 'https://www.b17.ru')).searchParams.get('page')))
    .get()
    .filter((value) => Number.isFinite(value))

  return pages.length > 0 ? Math.max(...pages) : 1
}

export async function listB17AuthorPublications(options: {
  authorSlug: string
  maxPages: number
  includeTypes: Array<'article' | 'blog'>
}) {
  const firstPageUrl = `https://www.b17.ru/articles/${options.authorSlug}/`
  const firstPage = await fetchExternalHtml(firstPageUrl)
  const firstPageItems = parseItemsFromAuthorPage(firstPage.html, firstPageUrl)

  if (firstPageItems.length === 0) {
    throw new ExternalImportError(
      'Не удалось найти публикации автора на странице всех публикаций B17',
      'b17_author_publications_not_found',
      firstPageUrl
    )
  }

  const totalPages = parseAuthorPageCount(firstPage.html)
  const effectivePageCount = Math.max(1, Math.min(options.maxPages, totalPages))
  const itemsByUrl = new Map<string, ExternalArticleListItem>()
  const warnings: string[] = []

  for (const item of firstPageItems) {
    if (options.includeTypes.includes(item.sourceType)) {
      itemsByUrl.set(item.url, item)
    }
  }

  for (let page = 2; page <= effectivePageCount; page += 1) {
    const pageUrl = `${firstPageUrl}?page=${page}`
    let pageItems: ExternalArticleListItem[] = []

    try {
      const currentPage = await fetchExternalHtml(pageUrl)
      pageItems = parseItemsFromAuthorPage(currentPage.html, pageUrl)
    } catch (error) {
      warnings.push(
        error instanceof Error
          ? error.message
          : `Не удалось загрузить страницу списка публикаций B17: ${pageUrl}`
      )
      continue
    }

    if (pageItems.length === 0) {
      warnings.push(`На странице списка B17 не найдено публикаций: ${pageUrl}`)
      break
    }

    for (const item of pageItems) {
      if (options.includeTypes.includes(item.sourceType)) {
        itemsByUrl.set(item.url, item)
      }
    }
  }

  return {
    items: [...itemsByUrl.values()],
    strategy: 'author_publications_page',
    pageCount: effectivePageCount,
    warnings,
  } satisfies ExternalListResult
}

export async function listB17ProfilePublications(options: {
  authorSlug: string
  includeTypes: Array<'article' | 'blog'>
}) {
  const profileUrl = `https://www.b17.ru/${options.authorSlug}/#article`
  const profilePage = await fetchExternalHtml(profileUrl)
  const items = parseItemsFromProfilePage(profilePage.html, profileUrl).filter((item) =>
    options.includeTypes.includes(item.sourceType)
  )

  if (items.length === 0) {
    throw new ExternalImportError(
      'Не удалось найти блок публикаций на странице автора B17',
      'b17_profile_publications_not_found',
      profileUrl
    )
  }

  return {
    items,
    strategy: 'profile_publications_block',
    pageCount: 1,
    warnings: [
      'Использован резервный источник списка публикаций через профиль автора B17.',
    ],
  } satisfies ExternalListResult
}

function deriveExcerpt($: ReturnType<typeof load>) {
  const metaDescription = normalizeWhitespace($('meta[name="description"]').attr('content') || '')

  if (metaDescription) {
    return metaDescription
  }

  const firstParagraph = normalizeWhitespace($('[itmprp="articleBody"] p').first().text())
  return truncateText(firstParagraph, 240)
}

function deriveCoverImage($: ReturnType<typeof load>, pageUrl: string) {
  const ogImage = normalizeAbsoluteUrl($('meta[property="og:image"]').attr('content') || '', pageUrl)

  if (ogImage) {
    return ogImage
  }

  return normalizeAbsoluteUrl(
    $('[itmprp="articleBody"] img').first().attr('src') || '',
    pageUrl
  )
}

export async function importB17ArticleByUrl(articleUrl: string) {
  const normalizedUrl = normalizeAbsoluteUrl(articleUrl)
  const sourceType = normalizedUrl ? detectPublicationType(normalizedUrl) : undefined

  if (!normalizedUrl || !sourceType) {
    throw new ExternalImportError(
      'Ссылка не похожа на публикацию B17 формата /article/{id}/ или /blog/{id}/',
      'b17_invalid_article_url',
      articleUrl
    )
  }

  const page = await fetchExternalHtml(normalizedUrl)
  const $ = load(page.html)
  const articleRoot = $('[itmprp="articleBody"]').first()

  if (articleRoot.length === 0) {
    throw new ExternalImportError(
      'На странице B17 не найден корневой блок содержимого статьи',
      'b17_article_body_not_found',
      normalizedUrl
    )
  }

  const title =
    normalizeWhitespace($('h1.from_bb_h1').first().text()) ||
    normalizeWhitespace($('title').text())

  if (!title) {
    throw new ExternalImportError(
      'Не удалось определить заголовок публикации B17',
      'b17_article_title_not_found',
      normalizedUrl
    )
  }

  const dateLabel = normalizeWhitespace($('[itmprp="datePublished"]').first().text())
  const sourceHtml = articleRoot.html() || ''
  const converted = await convertHtmlToBlocks(sourceHtml, normalizedUrl)
  const category = normalizeWhitespace($('.h1_razdel a').last().text())
  const tags = $('.tags_list a')
    .map((_, item) => normalizeWhitespace($(item).text()))
    .get()
    .filter(Boolean)
  const warnings = [...converted.warnings]
  const coverSource = deriveCoverImage($, normalizedUrl)
  let coverImage = coverSource || undefined

  if (coverSource) {
    const storedCover = await storeB17Image(coverSource)
    coverImage = storedCover.src || coverSource

    if (storedCover.error) {
      warnings.push(storedCover.error)
    }
  }

  return {
    source: 'b17',
    sourceType,
    title,
    sourceTitle: title,
    url: normalizeAbsoluteUrl($('link[rel="canonical"]').attr('href') || '', normalizedUrl) || normalizedUrl,
    originalId: extractOriginalId(normalizedUrl),
    originalPublishedAt: dateLabel ? parseB17Date(dateLabel) : undefined,
    dateLabel,
    excerpt: deriveExcerpt($),
    sourceExcerpt: deriveExcerpt($),
    coverImage,
    coverAlt: title,
    sourceHtml: converted.sanitizedHtml,
    contentBlocks: converted.blocks,
    category: category || undefined,
    tags,
    warnings: warnings.length > 0 ? [...new Set(warnings)] : undefined,
  } satisfies ExternalArticlePayload
}

export async function listB17Publications(options: {
  authorSlug: string
  maxPages: number
  includeTypes: Array<'article' | 'blog'>
}) {
  try {
    return await listB17AuthorPublications(options)
  } catch (primaryError) {
    const fallback = await listB17ProfilePublications(options)

    if (primaryError instanceof Error) {
      fallback.warnings.unshift(primaryError.message)
    }

    return fallback
  }
}
