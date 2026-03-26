'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader,
  Field,
  FormSection,
  InfoTip,
  Input,
  Toggle,
  useSaveSection,
} from '@/components/admin/AdminForm'
import {
  createEmptyBlogSection,
  normalizeBlogSection,
  type B17PublicationType,
  type BlogImportRun,
  type BlogImportStatus,
  type BlogPost,
  type BlogSection,
} from '@/lib/blog-schema'
import type { ImportCandidatePreview, ImportExecutionResult } from '@/lib/blog-import/types'

type BlogImportActionBody =
  | { action: 'check'; maxPages?: number }
  | { action: 'import-new'; maxPages?: number }
  | { action: 'import-url'; url: string }
  | { action: 'reimport'; postId: string }

interface BlogImportResponse {
  success: boolean
  blog: BlogSection
  result: ImportExecutionResult
  error?: string
}

function formatDateTime(value?: string) {
  if (!value) {
    return 'Не указано'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return 'Не указано'
  }

  return parsed.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getRunStatusLabel(status?: BlogImportRun['status']) {
  switch (status) {
    case 'success':
      return 'Успешно'
    case 'partial':
      return 'Частично'
    case 'error':
      return 'Ошибка'
    default:
      return 'Нет данных'
  }
}

function getImportStatusLabel(status?: BlogImportStatus) {
  switch (status) {
    case 'imported':
      return 'Импортировано'
    case 'updated':
      return 'Обновлено'
    case 'needs_review':
      return 'Требует проверки'
    case 'partial':
      return 'Импортировано частично'
    case 'error':
      return 'Ошибка импорта'
    case 'skipped':
      return 'Пропущено'
    default:
      return 'Не указано'
  }
}

function getPostStatusLabel(status: BlogPost['status']) {
  switch (status) {
    case 'published':
      return 'Опубликовано'
    case 'review':
      return 'Требует проверки'
    default:
      return 'Черновик'
  }
}

function getPublicationTypeLabel(type: B17PublicationType) {
  return type === 'blog' ? 'Заметка' : 'Статья'
}

async function executeImportAction(body: BlogImportActionBody) {
  const response = await fetch('/api/admin/blog-import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as BlogImportResponse

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Не удалось выполнить импорт B17.')
  }

  return data
}

export default function AdminBlogImportPage() {
  const { save, changed, setChanged } = useSaveSection('blog')
  const [loading, setLoading] = useState(true)
  const [runningAction, setRunningAction] = useState<string | null>(null)
  const [manualUrl, setManualUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [blog, setBlog] = useState<BlogSection>(createEmptyBlogSection())
  const [previewItems, setPreviewItems] = useState<ImportCandidatePreview[]>([])
  const [lastResult, setLastResult] = useState<ImportExecutionResult | null>(null)

  useEffect(() => {
    fetch('/api/admin/content')
      .then((response) => response.json())
      .then((data) => {
        const normalizedBlog = normalizeBlogSection(data.blog)
        setBlog(normalizedBlog)
      })
      .catch((fetchError) => {
        setError(fetchError instanceof Error ? fetchError.message : 'Не удалось загрузить настройки блога.')
      })
      .finally(() => setLoading(false))
  }, [])

  const importedPosts = useMemo(() => {
    return [...blog.posts]
      .filter((post) => post.sourceMeta?.source === 'b17')
      .sort((left, right) => {
        const leftTime = new Date(left.sourceMeta?.importedAt || left.updatedAt || 0).getTime()
        const rightTime = new Date(right.sourceMeta?.importedAt || right.updatedAt || 0).getTime()
        return rightTime - leftTime
      })
  }, [blog.posts])

  const lastRun = blog.imports.lastRun
  const newPreviewCount = previewItems.filter((item) => item.status === 'new').length

  const updateImportSettings = (updater: (current: BlogSection) => BlogSection) => {
    setBlog((current) => updater(current))
    setChanged(true)
  }

  const updateAuthorSlug = (value: string) => {
    const authorSlug = value.trim()

    updateImportSettings((current) => ({
      ...current,
      imports: {
        ...current.imports,
        b17: {
          ...current.imports.b17,
          authorSlug,
          authorProfileUrl: authorSlug ? `https://www.b17.ru/${authorSlug}/` : current.imports.b17.authorProfileUrl,
          authorPublicationsUrl: authorSlug ? `https://www.b17.ru/articles/${authorSlug}/` : current.imports.b17.authorPublicationsUrl,
        },
      },
    }))
  }

  const togglePublicationType = (type: B17PublicationType) => {
    updateImportSettings((current) => {
      const includeTypes = current.imports.b17.includeTypes.includes(type)
        ? current.imports.b17.includeTypes.filter((item) => item !== type)
        : [...current.imports.b17.includeTypes, type]

      return {
        ...current,
        imports: {
          ...current.imports,
          b17: {
            ...current.imports.b17,
            includeTypes: includeTypes.length > 0 ? includeTypes : [type],
          },
        },
      }
    })
  }

  const runAction = async (body: BlogImportActionBody, actionLabel: string) => {
    setRunningAction(actionLabel)
    setError(null)

    try {
      const data = await executeImportAction(body)
      setBlog(normalizeBlogSection(data.blog))
      setPreviewItems(data.result.previewItems || [])
      setLastResult(data.result)
      setChanged(false)

      if (body.action === 'import-url') {
        setManualUrl('')
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Не удалось выполнить действие импорта.')
    } finally {
      setRunningAction(null)
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center text-gray-400">Загружаем настройки импорта...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Импорт статей из B17"
        description="Проверяйте новые публикации автора, импортируйте их в блог сайта и переимпортируйте уже сохранённые материалы."
        onSave={() => save(blog)}
        changed={changed}
      />

      <div className="space-y-6">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormSection
          title="Настройки импорта B17"
          description="Здесь задаются базовые параметры поиска публикаций автора и поведение обновления уже импортированных статей."
        >
          <InfoTip>
            По умолчанию новые материалы импортируются в статусе «Требует проверки». Это безопасный режим: сначала статья попадает в черновой контур сайта, потом её можно спокойно отредактировать и опубликовать.
          </InfoTip>

          <Toggle
            label="Включить импорт из B17"
            hint="Если выключить, автоматические проверки можно не запускать. Уже импортированные статьи при этом останутся на сайте."
            checked={blog.imports.b17.enabled}
            onChange={(value) =>
              updateImportSettings((current) => ({
                ...current,
                imports: {
                  ...current.imports,
                  b17: {
                    ...current.imports.b17,
                    enabled: value,
                  },
                },
              }))
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Слаг автора на B17"
              value={blog.imports.b17.authorSlug}
              onChange={(event) => updateAuthorSlug(event.target.value)}
              placeholder="nesterova"
              hint="Используется для страницы профиля и страницы публикаций автора."
            />
            <Input
              type="number"
              min={1}
              max={50}
              label="Сколько страниц проверять за один запуск"
              value={String(blog.imports.b17.maxPagesPerSync)}
              onChange={(event) =>
                updateImportSettings((current) => ({
                  ...current,
                  imports: {
                    ...current.imports,
                    b17: {
                      ...current.imports.b17,
                      maxPagesPerSync: Math.max(1, Math.min(50, Number(event.target.value) || 1)),
                    },
                  },
                }))
              }
              hint="Если публикаций много, можно начать с 3–5 страниц, а затем увеличить лимит."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Страница профиля автора"
              value={blog.imports.b17.authorProfileUrl}
              readOnly
            />
            <Input
              label="Страница публикаций автора"
              value={blog.imports.b17.authorPublicationsUrl}
              readOnly
            />
          </div>

          <Toggle
            label="Автообновлять уже импортированные статьи при следующем запуске"
            hint="Если включено, повторные проверки смогут обновлять контент уже привязанных к B17 материалов. Если выключено, система только отметит, что статью видела, но не перепишет её автоматически."
            checked={blog.imports.b17.autoUpdateImportedPosts}
            onChange={(value) =>
              updateImportSettings((current) => ({
                ...current,
                imports: {
                  ...current.imports,
                  b17: {
                    ...current.imports.b17,
                    autoUpdateImportedPosts: value,
                  },
                },
              }))
            }
          />

          <Field
            label="Что импортировать"
            hint="Можно включить статьи, заметки или оба типа публикаций. Если оставить один тип, второй импортироваться не будет."
          >
            <div className="flex flex-wrap gap-3">
              {(['article', 'blog'] as B17PublicationType[]).map((type) => {
                const checked = blog.imports.b17.includeTypes.includes(type)

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePublicationType(type)}
                    className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                      checked
                        ? 'border-[#517a63] bg-[#517a63]/10 text-[#517a63]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {getPublicationTypeLabel(type)}
                  </button>
                )
              })}
            </div>
          </Field>
        </FormSection>

        <FormSection
          title="Запуск импорта"
          description="Проверяйте новые материалы автора, импортируйте всё новое сразу или подтягивайте отдельную публикацию вручную по ссылке."
        >
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => runAction({ action: 'check', maxPages: blog.imports.b17.maxPagesPerSync }, 'check')}
              disabled={Boolean(runningAction) || !blog.imports.b17.enabled}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {runningAction === 'check' ? 'Проверяем...' : 'Проверить новые статьи'}
            </button>
            <button
              type="button"
              onClick={() => runAction({ action: 'import-new', maxPages: blog.imports.b17.maxPagesPerSync }, 'import-new')}
              disabled={Boolean(runningAction) || !blog.imports.b17.enabled}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {runningAction === 'import-new' ? 'Импортируем...' : 'Импортировать новые'}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              label="Ручной импорт по URL"
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
              placeholder="https://www.b17.ru/article/863878/"
              hint="Подходит, если нужно подтянуть одну конкретную публикацию независимо от общего списка."
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => runAction({ action: 'import-url', url: manualUrl }, 'import-url')}
                disabled={Boolean(runningAction) || !manualUrl.trim()}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {runningAction === 'import-url' ? 'Импортируем...' : 'Импортировать по URL'}
              </button>
            </div>
          </div>

          {lastResult?.run ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
              <div className="font-medium text-gray-800">Последний ответ системы</div>
              <div className="mt-1">{lastResult.run.message || 'Операция выполнена.'}</div>
            </div>
          ) : null}
        </FormSection>

        <FormSection
          title="Что найдено на B17"
          description="После проверки здесь показывается список публикаций автора и видно, какие из них уже есть на сайте, а какие можно импортировать."
        >
          {previewItems.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Найдено</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-800">{previewItems.length}</div>
                </div>
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-green-600">Новые</div>
                  <div className="mt-2 text-2xl font-semibold text-green-700">{newPreviewCount}</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Уже на сайте</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-800">{previewItems.length - newPreviewCount}</div>
                </div>
              </div>

              <div className="space-y-3">
                {previewItems.map((item) => (
                  <div key={item.url} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className={`badge ${item.status === 'new' ? 'badge-sage' : 'badge-stone'}`}>
                            {item.status === 'new' ? 'Новая публикация' : 'Уже сопоставлена'}
                          </span>
                          <span className="badge badge-stone">{getPublicationTypeLabel(item.sourceType)}</span>
                          {item.importStatus ? (
                            <span className="badge badge-stone">{getImportStatusLabel(item.importStatus)}</span>
                          ) : null}
                        </div>
                        <div className="mt-3 text-lg font-semibold text-gray-900">{item.title}</div>
                        <div className="mt-2 text-sm text-gray-500">
                          {item.dateLabel || 'Дата на B17 не указана'}
                        </div>
                        {item.excerpt ? (
                          <p className="mt-3 text-sm leading-7 text-gray-600">{item.excerpt}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                        >
                          Открыть оригинал
                        </a>
                        {item.matchedPostId ? (
                          <Link href={`/admin/blog?post=${item.matchedPostId}`} className="btn-secondary">
                            Открыть в редакторе
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
              Сначала нажмите «Проверить новые статьи», чтобы увидеть найденные публикации автора.
            </div>
          )}
        </FormSection>

        <FormSection
          title="Импортированные статьи"
          description="Здесь собраны все публикации, которые уже привязаны к B17. Их можно открыть в редакторе сайта, переимпортировать и проверить исходный URL."
        >
          {importedPosts.length > 0 ? (
            <div className="space-y-3">
              {importedPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-sage">{getPostStatusLabel(post.status)}</span>
                        <span className="badge badge-stone">
                          {getImportStatusLabel(post.sourceMeta?.importStatus)}
                        </span>
                        {post.sourceMeta?.sourceType ? (
                          <span className="badge badge-stone">
                            {getPublicationTypeLabel(post.sourceMeta.sourceType)}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 text-lg font-semibold text-gray-900">{post.title}</div>
                      <div className="mt-2 text-sm text-gray-500">/blog/{post.slug}</div>

                      <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div>Дата импорта: {formatDateTime(post.sourceMeta?.importedAt)}</div>
                        <div>Последняя проверка: {formatDateTime(post.sourceMeta?.lastCheckedAt)}</div>
                        <div>Дата публикации оригинала: {formatDateTime(post.sourceMeta?.originalPublishedAt)}</div>
                        <div>Автообновление: {post.sourceMeta?.autoUpdate ? 'Включено' : 'Выключено'}</div>
                      </div>

                      {post.sourceMeta?.lastImportError ? (
                        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          {post.sourceMeta.lastImportError}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/blog?post=${post.id}`} className="btn-primary">
                        Редактировать
                      </Link>
                      <button
                        type="button"
                        onClick={() => runAction({ action: 'reimport', postId: post.id }, `reimport-${post.id}`)}
                        disabled={Boolean(runningAction)}
                        className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {runningAction === `reimport-${post.id}` ? 'Переимпортируем...' : 'Переимпортировать'}
                      </button>
                      {post.sourceMeta?.originalUrl ? (
                        <a
                          href={post.sourceMeta.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                        >
                          Открыть оригинал
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
              Пока нет ни одной статьи, импортированной из B17.
            </div>
          )}
        </FormSection>

        <FormSection
          title="Последний запуск"
          description="Здесь видно, как завершилась последняя проверка или импорт, сколько материалов было найдено и были ли предупреждения."
        >
          {lastRun ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Статус</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">{getRunStatusLabel(lastRun.status)}</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Проверено</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">{lastRun.stats.scanned}</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Импортировано</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">{lastRun.stats.imported}</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Ошибок</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">{lastRun.stats.failed}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
                <div>Запуск: {formatDateTime(lastRun.startedAt)}</div>
                <div>Завершение: {formatDateTime(lastRun.finishedAt)}</div>
                {lastRun.message ? <div className="mt-2 font-medium text-gray-800">{lastRun.message}</div> : null}
              </div>

              {lastRun.errors.length > 0 ? (
                <div className="space-y-3">
                  {lastRun.errors.map((runError, index) => (
                    <div key={`${runError.createdAt}-${index}`} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                      <div className="font-medium">{runError.message}</div>
                      {runError.articleTitle ? <div className="mt-1">Статья: {runError.articleTitle}</div> : null}
                      {runError.articleUrl ? (
                        <a
                          href={runError.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex text-amber-900 underline underline-offset-4"
                        >
                          Открыть проблемный URL
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-6 text-sm text-gray-500">
                  В последнем запуске предупреждений и ошибок не было.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
              История запусков появится после первой проверки или первого импорта.
            </div>
          )}
        </FormSection>
      </div>
    </AdminShell>
  )
}
