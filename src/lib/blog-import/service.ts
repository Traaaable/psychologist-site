import {
  createEmptyImportRunStats,
  createEmptyPost,
  createImportRunId,
  ensureUniqueSlug,
  normalizeBlogSection,
  slugify,
  type BlogImportRun,
  type BlogImportRunError,
  type BlogImportRunKind,
  type BlogImportRunStatus,
  type BlogPost,
} from '@/lib/blog-schema'
import { importB17ArticleByUrl, listB17Publications } from '@/lib/blog-import/sources/b17'
import type {
  ExternalArticleListItem,
  ExternalArticlePayload,
  ImportCandidatePreview,
  ImportExecutionResult,
  ImportOperationResult,
} from '@/lib/blog-import/types'
import type { SiteContent } from '@/lib/content'

function normalizeComparableUrl(input?: string) {
  if (!input) {
    return ''
  }

  try {
    const url = new URL(input)
    url.hash = ''
    url.search = ''
    return url.toString()
  } catch {
    return input.trim()
  }
}

function normalizeComparableTitle(input?: string) {
  return input?.trim().toLowerCase() || ''
}

function createRun(kind: BlogImportRunKind): BlogImportRun {
  return {
    id: createImportRunId(),
    source: 'b17',
    kind,
    startedAt: new Date().toISOString(),
    status: 'success',
    stats: createEmptyImportRunStats(),
    errors: [],
  }
}

function finalizeRun(run: BlogImportRun, status: BlogImportRunStatus, message: string) {
  run.status = status
  run.message = message
  run.finishedAt = new Date().toISOString()
  return run
}

function appendRun(content: SiteContent, run: BlogImportRun) {
  const blog = normalizeBlogSection(content.blog)

  content.blog = {
    ...blog,
    imports: {
      ...blog.imports,
      lastRun: run,
      runs: [run, ...blog.imports.runs].slice(0, 20),
    },
  }

  return content
}

function createRunError(error: unknown, articleUrl?: string, articleTitle?: string): BlogImportRunError {
  return {
    code: error instanceof Error && 'code' in error ? String(error.code || '') || undefined : undefined,
    message: error instanceof Error ? error.message : 'Неизвестная ошибка импорта',
    articleUrl,
    articleTitle,
    createdAt: new Date().toISOString(),
  }
}

function appendWarningsToRun(
  run: BlogImportRun,
  warnings: string[],
  articleUrl?: string,
  articleTitle?: string,
  code = 'import_warning'
) {
  for (const warning of [...new Set(warnings)].filter(Boolean)) {
    run.errors.push({
      code,
      message: warning,
      articleUrl,
      articleTitle,
      createdAt: new Date().toISOString(),
    })
  }
}

function findMatchingPost(posts: BlogPost[], item: Pick<ExternalArticleListItem, 'url' | 'originalId' | 'title'>) {
  const comparableUrl = normalizeComparableUrl(item.url)
  const comparableTitle = normalizeComparableTitle(item.title)
  const comparableSlug = item.title ? slugify(item.title) : ''

  return (
    posts.find((post) => {
      if (!post.sourceMeta || post.sourceMeta.source !== 'b17') {
        return false
      }

      return (
        normalizeComparableUrl(post.sourceMeta.originalUrl) === comparableUrl ||
        (item.originalId && post.sourceMeta.originalId === item.originalId)
      )
    }) ||
    posts.find(
      (post) =>
        Boolean(comparableSlug && post.slug === comparableSlug) ||
        normalizeComparableTitle(post.title) === comparableTitle
    )
  )
}

function buildPreviewItems(posts: BlogPost[], items: ExternalArticleListItem[]): ImportCandidatePreview[] {
  return items.map((item) => {
    const matchedPost = findMatchingPost(posts, item)

    return {
      ...item,
      status: matchedPost ? 'existing' : 'new',
      matchedPostId: matchedPost?.id,
      matchedPostTitle: matchedPost?.title,
      importStatus: matchedPost?.sourceMeta?.importStatus,
    }
  })
}

function touchExistingPost(post: BlogPost, item: ExternalArticleListItem, checkedAt: string) {
  return {
    ...post,
    sourceMeta: post.sourceMeta
      ? {
          ...post.sourceMeta,
          lastCheckedAt: checkedAt,
          sourceTitle: item.title,
          sourceExcerpt: item.excerpt || post.sourceMeta.sourceExcerpt,
          sourceCoverImage: item.coverImage || post.sourceMeta.sourceCoverImage,
        }
      : post.sourceMeta,
  }
}

function markPostImportFailure(
  post: BlogPost,
  item: Pick<
    ExternalArticleListItem,
    'url' | 'originalId' | 'originalPublishedAt' | 'title' | 'excerpt' | 'coverImage'
  >,
  message: string,
  checkedAt: string
) {
  return {
    ...post,
    sourceMeta: {
      source: 'b17',
      sourceType: post.sourceMeta?.sourceType,
      originalUrl: normalizeComparableUrl(item.url) || item.url,
      originalId: item.originalId || post.sourceMeta?.originalId,
      originalPublishedAt: item.originalPublishedAt || post.sourceMeta?.originalPublishedAt,
      importedAt: post.sourceMeta?.importedAt,
      lastCheckedAt: checkedAt,
      importStatus: 'error',
      lastImportError: message,
      sourceTitle: item.title || post.sourceMeta?.sourceTitle,
      sourceExcerpt: item.excerpt || post.sourceMeta?.sourceExcerpt,
      sourceCoverImage: item.coverImage || post.sourceMeta?.sourceCoverImage,
      sourceHtml: post.sourceMeta?.sourceHtml,
      autoUpdate: post.sourceMeta?.autoUpdate ?? false,
    },
  } satisfies BlogPost
}

function buildImportedPost(
  posts: BlogPost[],
  payload: ExternalArticlePayload,
  existingPost: BlogPost | undefined,
  autoUpdateImportedPosts: boolean
) {
  const fallback = createEmptyPost()
  const now = new Date().toISOString()
  const basePost = existingPost || fallback
  const shouldPreserveExisting = Boolean(existingPost)
  const currentSourceMeta = existingPost?.sourceMeta
  const importedAt = currentSourceMeta?.importedAt || now
  const nextStatus = existingPost?.status || 'review'
  const warnings = [...new Set(payload.warnings || [])]
  const hasWarnings = warnings.length > 0
  const canReplaceCover =
    !existingPost?.coverImage ||
    !currentSourceMeta?.sourceCoverImage ||
    existingPost.coverImage === currentSourceMeta.sourceCoverImage
  const nextCoverImage = canReplaceCover
    ? payload.coverImage || existingPost?.coverImage
    : existingPost?.coverImage
  const nextCoverAlt = canReplaceCover
    ? payload.coverAlt || existingPost?.coverAlt || existingPost?.title || payload.title
    : existingPost?.coverAlt || payload.coverAlt || existingPost?.title || payload.title
  const nextImportStatus = hasWarnings ? 'partial' : existingPost ? 'updated' : 'needs_review'
  const nextSlug =
    existingPost?.slug ||
    ensureUniqueSlug(
      posts,
      payload.title || payload.originalId || fallback.id,
      existingPost?.id || fallback.id
    )

  return {
    ...basePost,
    id: existingPost?.id || fallback.id,
    slug: nextSlug,
    status: nextStatus === 'published' ? 'published' : nextStatus === 'draft' ? 'draft' : 'review',
    title: shouldPreserveExisting && existingPost?.title ? existingPost.title : payload.title,
    excerpt:
      shouldPreserveExisting && existingPost?.excerpt
        ? existingPost.excerpt
        : payload.excerpt || payload.sourceExcerpt,
    coverImage: nextCoverImage,
    coverAlt: nextCoverAlt,
    category:
      shouldPreserveExisting && existingPost?.category
        ? existingPost.category
        : payload.category || (payload.sourceType === 'blog' ? 'Заметки B17' : 'Статьи B17'),
    tags:
      shouldPreserveExisting && (existingPost?.tags?.length || 0) > 0
        ? existingPost?.tags || []
        : payload.tags || [],
    publishedAt: existingPost?.publishedAt || payload.originalPublishedAt,
    updatedAt: now,
    seo: {
      title:
        shouldPreserveExisting && existingPost?.seo.title
          ? existingPost.seo.title
          : payload.title,
      description:
        shouldPreserveExisting && existingPost?.seo.description
          ? existingPost.seo.description
          : payload.sourceExcerpt,
      canonicalUrl: existingPost?.seo.canonicalUrl || '',
    },
    serviceIds: existingPost?.serviceIds || [],
    relatedPageKeys:
      (existingPost?.relatedPageKeys?.length || 0) > 0
        ? existingPost?.relatedPageKeys || []
        : ['services', 'contact'],
    relatedPostIds: existingPost?.relatedPostIds || [],
    isFeatured: existingPost?.isFeatured || false,
    cta: existingPost?.cta || fallback.cta,
    content:
      payload.contentBlocks.length > 0
        ? payload.contentBlocks
        : (existingPost?.content?.length || 0) > 0
          ? existingPost?.content || fallback.content
          : fallback.content,
    sourceMeta: {
      source: 'b17',
      sourceType: payload.sourceType,
      originalUrl: normalizeComparableUrl(payload.url) || payload.url,
      originalId: payload.originalId,
      originalPublishedAt: payload.originalPublishedAt,
      importedAt,
      lastCheckedAt: now,
      importStatus: nextImportStatus,
      lastImportError: hasWarnings ? warnings.join('\n') : undefined,
      sourceTitle: payload.sourceTitle,
      sourceExcerpt: payload.sourceExcerpt,
      sourceCoverImage: payload.coverImage,
      sourceHtml: payload.sourceHtml,
      autoUpdate: currentSourceMeta?.autoUpdate ?? autoUpdateImportedPosts,
    },
  } satisfies BlogPost
}

function upsertPost(posts: BlogPost[], nextPost: BlogPost) {
  const existingIndex = posts.findIndex((post) => post.id === nextPost.id)

  if (existingIndex === -1) {
    return [nextPost, ...posts]
  }

  const updatedPosts = [...posts]
  updatedPosts[existingIndex] = nextPost
  return updatedPosts
}

async function importSinglePayload(
  content: SiteContent,
  payload: ExternalArticlePayload,
  run: BlogImportRun
): Promise<ImportOperationResult> {
  const blog = normalizeBlogSection(content.blog)
  const matchedPost = findMatchingPost(blog.posts, payload)
  const warnings = [...new Set(payload.warnings || [])]

  if (warnings.length > 0) {
    appendWarningsToRun(run, warnings, payload.url, payload.title, 'partial_import_warning')
  }

  const nextPost = buildImportedPost(
    blog.posts,
    payload,
    matchedPost,
    blog.imports.b17.autoUpdateImportedPosts
  )

  content.blog = {
    ...blog,
    posts: upsertPost(blog.posts, nextPost),
  }

  if (matchedPost) {
    run.stats.updated += 1
    return {
      changed: true,
      action: 'updated',
      postId: nextPost.id,
      slug: nextPost.slug,
      title: nextPost.title,
      originalUrl: payload.url,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }

  run.stats.imported += 1
  return {
    changed: true,
    action: 'created',
    postId: nextPost.id,
    slug: nextPost.slug,
    title: nextPost.title,
    originalUrl: payload.url,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

export async function previewB17Sync(content: SiteContent, options?: { maxPages?: number }) {
  const blog = normalizeBlogSection(content.blog)
  const listResult = await listB17Publications({
    authorSlug: blog.imports.b17.authorSlug,
    maxPages: options?.maxPages || blog.imports.b17.maxPagesPerSync,
    includeTypes: blog.imports.b17.includeTypes,
  })

  return buildPreviewItems(blog.posts, listResult.items)
}

export async function runB17Check(content: SiteContent, options?: { maxPages?: number }): Promise<ImportExecutionResult> {
  const run = createRun('sync')
  const blog = normalizeBlogSection(content.blog)
  const listResult = await listB17Publications({
    authorSlug: blog.imports.b17.authorSlug,
    maxPages: options?.maxPages || blog.imports.b17.maxPagesPerSync,
    includeTypes: blog.imports.b17.includeTypes,
  })
  const previewItems = buildPreviewItems(blog.posts, listResult.items)
  const newItemsCount = previewItems.filter((item) => item.status === 'new').length

  run.stats.scanned = listResult.items.length
  appendWarningsToRun(run, listResult.warnings)

  finalizeRun(
    run,
    listResult.warnings.length > 0 ? 'partial' : 'success',
    newItemsCount > 0
      ? `Найдено ${newItemsCount} новых публикаций B17 для импорта.`
      : 'Новых публикаций B17 не найдено.'
  )

  appendRun(content, run)

  return {
    run,
    previewItems,
    operations: [],
  }
}

export async function runB17ImportNew(
  content: SiteContent,
  options?: { maxPages?: number }
): Promise<ImportExecutionResult> {
  const run = createRun('sync')
  const operations: ImportOperationResult[] = []
  const blog = normalizeBlogSection(content.blog)
  const listResult = await listB17Publications({
    authorSlug: blog.imports.b17.authorSlug,
    maxPages: options?.maxPages || blog.imports.b17.maxPagesPerSync,
    includeTypes: blog.imports.b17.includeTypes,
  })
  const checkedAt = new Date().toISOString()
  let nextPosts = [...blog.posts]

  appendWarningsToRun(run, listResult.warnings)

  for (const item of listResult.items) {
    run.stats.scanned += 1
    const matchedPost = findMatchingPost(nextPosts, item)
    const shouldAutoUpdateExisting = matchedPost?.sourceMeta?.source === 'b17'
      ? matchedPost.sourceMeta.autoUpdate
      : true

    if (matchedPost) {
      nextPosts = nextPosts.map((post) =>
        post.id === matchedPost.id ? touchExistingPost(post, item, checkedAt) : post
      )

      if (!shouldAutoUpdateExisting) {
        run.stats.skipped += 1
        operations.push({
          changed: false,
          action: 'skipped',
          postId: matchedPost.id,
          slug: matchedPost.slug,
          title: matchedPost.title,
          originalUrl: item.url,
        })
        continue
      }
    }

    try {
      const payload = await importB17ArticleByUrl(item.url)
      const tempContent = {
        ...content,
        blog: {
          ...blog,
          posts: nextPosts,
        },
      } satisfies SiteContent
      const operation = await importSinglePayload(tempContent, payload, run)
      operations.push(operation)
      nextPosts = normalizeBlogSection(tempContent.blog).posts
    } catch (error) {
      run.stats.failed += 1
      run.errors.push(createRunError(error, item.url, item.title))

      if (matchedPost) {
        const failureMessage =
          error instanceof Error ? error.message : 'Не удалось импортировать публикацию B17'

        nextPosts = nextPosts.map((post) =>
          post.id === matchedPost.id
            ? markPostImportFailure(post, item, failureMessage, checkedAt)
            : post
        )
      }
    }
  }

  content.blog = {
    ...blog,
    posts: nextPosts,
  }

  const status: BlogImportRunStatus =
    run.stats.failed > 0
      ? operations.length > 0
        ? 'partial'
        : 'error'
      : listResult.warnings.length > 0 || operations.some((operation) => operation.warnings?.length)
        ? 'partial'
        : 'success'

  const message =
    operations.length > 0
      ? `Импортировано: ${run.stats.imported}, обновлено: ${run.stats.updated}, пропущено: ${run.stats.skipped}, ошибок: ${run.stats.failed}.`
      : run.stats.failed > 0
        ? 'Импорт новых публикаций завершился с ошибками.'
        : 'Новых публикаций для импорта не найдено.'

  finalizeRun(run, status, message)
  appendRun(content, run)

  return {
    run,
    previewItems: buildPreviewItems(nextPosts, listResult.items),
    operations,
  }
}

export async function runB17ImportByUrl(
  content: SiteContent,
  url: string
): Promise<ImportExecutionResult> {
  const run = createRun('manual-url')
  const operations: ImportOperationResult[] = []

  try {
    const payload = await importB17ArticleByUrl(url)
    const operation = await importSinglePayload(content, payload, run)
    operations.push(operation)
    run.stats.scanned = 1

    finalizeRun(
      run,
      operation.warnings?.length ? 'partial' : 'success',
      operation.action === 'updated'
        ? 'Публикация B17 переимпортирована по URL.'
        : 'Публикация B17 импортирована по URL.'
    )
  } catch (error) {
    run.stats.scanned = 1
    run.stats.failed = 1
    run.errors.push(createRunError(error, url))
    finalizeRun(run, 'error', 'Не удалось импортировать публикацию B17 по URL.')
  }

  appendRun(content, run)

  return {
    run,
    operations,
  }
}

export async function runB17ReimportPost(
  content: SiteContent,
  postId: string
): Promise<ImportExecutionResult> {
  const run = createRun('reimport')
  const blog = normalizeBlogSection(content.blog)
  const post = blog.posts.find((item) => item.id === postId)

  if (!post?.sourceMeta?.originalUrl) {
    run.stats.failed = 1
    run.errors.push(
      createRunError(
        new Error('У статьи нет сохранённого original_url для переимпорта.'),
        undefined,
        post?.title
      )
    )
    finalizeRun(run, 'error', 'Переимпорт невозможен: не найден original_url.')
    appendRun(content, run)

    return {
      run,
      operations: [],
    }
  }

  const operations: ImportOperationResult[] = []
  const sourceMeta = post.sourceMeta

  try {
    const payload = await importB17ArticleByUrl(sourceMeta.originalUrl)
    const operation = await importSinglePayload(content, payload, run)
    operations.push(operation)
    run.stats.scanned = 1
    finalizeRun(
      run,
      operation.warnings?.length ? 'partial' : 'success',
      'Статья переимпортирована из B17.'
    )
  } catch (error) {
    run.stats.scanned = 1
    run.stats.failed = 1
    run.errors.push(createRunError(error, sourceMeta.originalUrl, post.title))
    content.blog = {
      ...blog,
      posts: blog.posts.map((item) =>
        item.id === post.id
          ? markPostImportFailure(
              item,
              {
                url: sourceMeta.originalUrl,
                originalId: sourceMeta.originalId,
                originalPublishedAt: sourceMeta.originalPublishedAt,
                title: sourceMeta.sourceTitle || post.title,
                excerpt: sourceMeta.sourceExcerpt,
                coverImage: sourceMeta.sourceCoverImage,
              },
              error instanceof Error ? error.message : 'Не удалось переимпортировать публикацию B17',
              new Date().toISOString()
            )
          : item
      ),
    }
    finalizeRun(run, 'error', 'Переимпорт статьи завершился ошибкой.')
  }

  appendRun(content, run)

  return {
    run,
    operations,
  }
}
