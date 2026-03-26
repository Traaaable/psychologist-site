'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { BlogBlocksEditor } from '@/components/admin/BlogBlocksEditor'
import { BlogPreview } from '@/components/admin/BlogPreview'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import {
  AdminPageHeader,
  ConfirmDelete,
  Field,
  FormSection,
  InfoTip,
  Input,
  ListCard,
  Select,
  Textarea,
  Toggle,
  useSaveSection,
} from '@/components/admin/AdminForm'
import {
  createEmptyBlogSection,
  createEmptyPost,
  ensureUniqueSlug,
  normalizeBlogSection,
  type BlogPost,
  type BlogSection,
} from '@/lib/blog-schema'
import { SITE_PAGE_LINKS } from '@/lib/blog-utils'
import type { ServiceItem } from '@/lib/content'

function formatDateForInput(value?: string) {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toISOString().slice(0, 10)
}

function parseTags(raw: string) {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
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

export default function AdminBlogPage() {
  const searchParams = useSearchParams()
  const { save, changed, setChanged } = useSaveSection('blog')
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState<BlogSection>(createEmptyBlogSection())
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [specialistName, setSpecialistName] = useState('Психолог')
  const [specialistTitle, setSpecialistTitle] = useState('Психолог-консультант')
  const [specialistMeta, setSpecialistMeta] = useState('')
  const requestedPostId = searchParams.get('post')

  useEffect(() => {
    fetch('/api/admin/content')
      .then((response) => response.json())
      .then((data) => {
        const normalizedBlog = normalizeBlogSection(data.blog)
        setBlog(normalizedBlog)
        setServices(data.services || [])
        setSelectedPostId(
          normalizedBlog.posts.some((post) => post.id === requestedPostId)
            ? requestedPostId
            : normalizedBlog.posts[0]?.id || null
        )
        setSpecialistName(data.specialist?.name || data.specialist?.shortName || 'Психолог')
        setSpecialistTitle(data.specialist?.title || 'Психолог-консультант')
        setSpecialistMeta(
          [data.specialist?.experience ? `опыт ${data.specialist.experience}` : '', data.location?.city || '']
            .filter(Boolean)
            .join(' • ')
        )
      })
      .finally(() => setLoading(false))
  }, [requestedPostId])

  const selectedPost = blog.posts.find((post) => post.id === selectedPostId) || null

  const visibleServices = services.filter((service) => service.visible)

  const previewRelatedServices = useMemo(() => {
    if (!selectedPost) {
      return []
    }

    return selectedPost.serviceIds
      .map((serviceId) => visibleServices.find((service) => service.id === serviceId))
      .filter((service): service is ServiceItem => Boolean(service))
      .map((service) => ({
        id: service.id,
        title: service.title,
        description: service.shortDesc,
        href: `/services#${service.id}`,
      }))
  }, [selectedPost, visibleServices])

  const previewRelatedPages = useMemo(() => {
    if (!selectedPost) {
      return []
    }

    return selectedPost.relatedPageKeys
      .map((pageKey) => SITE_PAGE_LINKS.find((page) => page.key === pageKey))
      .filter((page): page is (typeof SITE_PAGE_LINKS)[number] => Boolean(page))
      .map((page) => ({
        id: page.key,
        title: page.title,
        description: page.description,
        href: page.href,
      }))
  }, [selectedPost])

  const updateBlogField = (field: keyof Omit<BlogSection, 'posts'>, value: string) => {
    setBlog((currentBlog) => ({ ...currentBlog, [field]: value }))
    setChanged(true)
  }

  const updatePost = (postId: string, updater: (post: BlogPost, posts: BlogPost[]) => BlogPost) => {
    setBlog((currentBlog) => ({
      ...currentBlog,
      posts: currentBlog.posts.map((post) =>
        post.id === postId ? updater(post, currentBlog.posts) : post
      ),
    }))
    setChanged(true)
  }

  const createPost = () => {
    const draft = createEmptyPost()
    draft.title = 'Новая статья'
    draft.slug = ensureUniqueSlug(blog.posts, draft.title, draft.id)

    setBlog((currentBlog) => ({
      ...currentBlog,
      posts: [draft, ...currentBlog.posts],
    }))
    setSelectedPostId(draft.id)
    setChanged(true)
  }

  const deletePost = (postId: string) => {
    setBlog((currentBlog) => ({
      ...currentBlog,
      posts: currentBlog.posts.filter((post) => post.id !== postId),
    }))
    setDeletingId(null)

    if (selectedPostId === postId) {
      const nextPost = blog.posts.find((post) => post.id !== postId)
      setSelectedPostId(nextPost?.id || null)
    }

    setChanged(true)
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center text-gray-400">Загружаем блог...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Блог"
        description="Статьи для поискового продвижения, доверия и переходов на основные страницы сайта."
        onSave={() => save(blog)}
        changed={changed}
      />

      <div className="space-y-6">
        <FormSection
          title="Настройки раздела"
          description="Эти тексты видны на самой странице блога. Они помогают сразу объяснить посетителю, о чем раздел."
        >
          <InfoTip>
            Блог здесь задуман не как новости, а как полезные статьи, которые приводят человека к записи, услугам и другим ключевым страницам сайта.
          </InfoTip>

          <Input
            label="Заголовок страницы блога"
            value={blog.heading}
            onChange={(event) => updateBlogField('heading', event.target.value)}
            placeholder="Блог психолога в Омске"
            hint="Например: «Блог психолога», «Статьи о тревоге и отношениях», «Полезные материалы». Если оставить пустым, сайт подставит аккуратный вариант сам."
          />
          <Textarea
            label="Короткое описание блога"
            value={blog.description}
            onChange={(event) => updateBlogField('description', event.target.value)}
            rows={3}
            placeholder="Коротко объясните, чем полезны статьи и куда они ведут посетителя."
            hint="2–3 спокойных предложения. Это описание помогает и посетителю, и поисковикам понять смысл раздела."
          />
        </FormSection>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-5">
            <FormSection
              title="Все статьи"
              description="Выберите материал для редактирования или создайте новую статью."
            >
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={createPost}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Создать новую статью
                </button>

                {blog.posts.length > 0 ? (
                  <div className="space-y-2">
                    {blog.posts.map((post) => (
                      <div
                        key={post.id}
                        className={selectedPostId === post.id ? 'rounded-xl ring-2 ring-[#517a63]/25 ring-offset-2 ring-offset-white' : ''}
                      >
                        <ListCard
                          title={post.title || 'Без названия'}
                          subtitle={`${post.status === 'published' ? 'Опубликовано' : 'Черновик'} • /blog/${post.slug || 'slug'}${selectedPostId === post.id ? ' • открыто справа' : ''}`}
                          visible={post.status === 'published'}
                          onToggleVisible={() =>
                            updatePost(post.id, (currentPost) => ({
                              ...currentPost,
                              status:
                                currentPost.status === 'published'
                                  ? currentPost.sourceMeta?.source === 'b17'
                                    ? 'review'
                                    : 'draft'
                                  : 'published',
                            }))
                          }
                          onEdit={() => setSelectedPostId(post.id)}
                          onDelete={() => setDeletingId(post.id)}
                        />
                        <ConfirmDelete
                          isOpen={deletingId === post.id}
                          itemName={post.title || 'Без названия'}
                          onConfirm={() => deletePost(post.id)}
                          onCancel={() => setDeletingId(null)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    Пока нет ни одной статьи. Нажмите «Создать новую статью».
                  </div>
                )}
              </div>
            </FormSection>
          </div>

          <div className="space-y-5">
            {selectedPost ? (
              <>
                <FormSection
                  title="Основная информация"
                  description="Поля, которые влияют на саму статью, ее URL и карточку в списке блога."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Заголовок статьи"
                      value={selectedPost.title}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost, posts) => {
                          const autoSlug = ensureUniqueSlug(
                            posts,
                            currentPost.title || currentPost.slug || currentPost.id,
                            currentPost.id
                          )
                          const shouldUpdateSlug = !currentPost.slug || currentPost.slug === autoSlug

                          return {
                            ...currentPost,
                            title: event.target.value,
                            slug: shouldUpdateSlug
                              ? ensureUniqueSlug(posts, event.target.value || currentPost.id, currentPost.id)
                              : currentPost.slug,
                          }
                        })
                      }
                      placeholder="Например: Как понять, что тревога стала хронической"
                      required
                    />
                    <Input
                      label="Адрес статьи (slug)"
                      value={selectedPost.slug}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost, posts) => ({
                          ...currentPost,
                          slug: ensureUniqueSlug(posts, event.target.value || currentPost.title || currentPost.id, currentPost.id),
                        }))
                      }
                      placeholder="kak-ponyat-chto-trevoga-stala-khronicheskoi"
                      hint="Человекопонятный адрес страницы. Латиницей, через дефис. Можно просто поправить вручную."
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Select
                      label="Статус"
                      value={selectedPost.status}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          status:
                            event.target.value === 'published'
                              ? 'published'
                              : event.target.value === 'review'
                                ? 'review'
                                : 'draft',
                        }))
                      }
                      options={[
                        { value: 'draft', label: 'Черновик' },
                        { value: 'published', label: 'Опубликовано' },
                      ]}
                    />
                    <Input
                      type="date"
                      label="Дата публикации"
                      value={formatDateForInput(selectedPost.publishedAt)}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          publishedAt: event.target.value || undefined,
                        }))
                      }
                      hint="Если статья уже готова, можно сразу поставить нужную дату."
                    />
                    <Input
                      label="Категория"
                      value={selectedPost.category}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          category: event.target.value,
                        }))
                      }
                      placeholder="Тревога, отношения, самооценка..."
                    />
                  </div>

                  <Textarea
                    label="Короткий анонс"
                    value={selectedPost.excerpt}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        excerpt: event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="2–4 предложения, которые кратко объясняют пользу статьи."
                    hint="Этот текст используется в карточке статьи, в поиске и в соцсетях."
                  />

                  <Input
                    label="Теги"
                    value={selectedPost.tags.join(', ')}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        tags: parseTags(event.target.value),
                      }))
                    }
                    placeholder="тревога, самопомощь, отношения"
                    hint="Можно перечислить через запятую. Теги помогают фильтрации и внутренней перелинковке."
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Toggle
                      label="Показывать как рекомендуемую статью"
                      hint="Эта статья сможет появляться в верхнем блоке блога."
                      checked={selectedPost.isFeatured}
                      onChange={(value) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          isFeatured: value,
                        }))
                      }
                    />
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                      Публичный адрес:
                      <div className="mt-2 font-medium text-gray-700">
                        /blog/{selectedPost.slug || 'slug'}
                      </div>
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Обложка статьи"
                  description="Хорошая обложка помогает кликабельности карточки статьи и выглядит аккуратно в соцсетях."
                >
                  <ImageUploadField
                    label="Обложка"
                    value={selectedPost.coverImage}
                    onChange={(url) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        coverImage: url,
                      }))
                    }
                    altValue={selectedPost.coverAlt}
                    onAltChange={(value) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        coverAlt: value,
                      }))
                    }
                    hint="Можно вставить ссылку вручную или загрузить изображение с компьютера. Лучше использовать спокойную, профессиональную визуальную обложку."
                  />
                </FormSection>

                <FormSection
                  title="SEO и карточка в поиске"
                  description="Эти поля помогают точнее управлять тем, как статья выглядит в поисковиках и при отправке ссылки."
                >
                  <InfoTip>
                    Если поля оставить пустыми, сайт возьмет обычный заголовок и анонс статьи. Но для важных материалов лучше задать SEO-вариант вручную.
                  </InfoTip>

                  <Input
                    label="SEO title"
                    value={selectedPost.seo.title}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        seo: {
                          ...currentPost.seo,
                          title: event.target.value,
                        },
                      }))
                    }
                    placeholder="Психолог в Омске: как справиться с тревогой без самообвинения"
                    hint="До 60–70 символов. Это заголовок для поисковика."
                  />
                  <Textarea
                    label="SEO description"
                    value={selectedPost.seo.description}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        seo: {
                          ...currentPost.seo,
                          description: event.target.value,
                        },
                      }))
                    }
                    rows={3}
                    placeholder="Кратко объясните, о чем статья и кому она будет полезна."
                    hint="До 150–160 символов. Это описание в поисковой выдаче."
                  />
                </FormSection>

                <FormSection
                  title="Переходы на основные страницы сайта"
                  description="Здесь настраивается, куда статья будет вести посетителя дальше: к услугам, записи, ценам, страницам доверия."
                >
                  <div className="space-y-4">
                    <Field
                      label="Связанные направления помощи"
                      hint="Выберите услуги, которые логично связаны с темой статьи."
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        {visibleServices.map((service) => {
                          const checked = selectedPost.serviceIds.includes(service.id)
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() =>
                                updatePost(selectedPost.id, (currentPost) => ({
                                  ...currentPost,
                                  serviceIds: checked
                                    ? currentPost.serviceIds.filter((id) => id !== service.id)
                                    : [...currentPost.serviceIds, service.id],
                                }))
                              }
                              className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                                checked
                                  ? 'border-[#517a63] bg-[#517a63]/5'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium text-gray-800">{service.title}</div>
                              <div className="mt-1 text-sm text-gray-500">{service.shortDesc}</div>
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <Field
                      label="Связанные страницы сайта"
                      hint="Эти ссылки будут показаны в статье как аккуратные переходы на важные разделы сайта."
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        {SITE_PAGE_LINKS.map((page) => {
                          const checked = selectedPost.relatedPageKeys.includes(page.key)
                          return (
                            <button
                              key={page.key}
                              type="button"
                              onClick={() =>
                                updatePost(selectedPost.id, (currentPost) => ({
                                  ...currentPost,
                                  relatedPageKeys: checked
                                    ? currentPost.relatedPageKeys.filter((key) => key !== page.key)
                                    : [...currentPost.relatedPageKeys, page.key],
                                }))
                              }
                              className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                                checked
                                  ? 'border-[#517a63] bg-[#517a63]/5'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium text-gray-800">{page.title}</div>
                              <div className="mt-1 text-sm text-gray-500">{page.description}</div>
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <Field
                      label="Похожие статьи"
                      hint="Можно связать статью с другими материалами блога. Это усиливает перелинковку и удержание пользователя."
                    >
                      <div className="space-y-2">
                        {blog.posts
                          .filter((post) => post.id !== selectedPost.id)
                          .map((post) => {
                            const checked = selectedPost.relatedPostIds.includes(post.id)
                            return (
                              <label
                                key={post.id}
                                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    updatePost(selectedPost.id, (currentPost) => ({
                                      ...currentPost,
                                      relatedPostIds: checked
                                        ? currentPost.relatedPostIds.filter((id) => id !== post.id)
                                        : [...currentPost.relatedPostIds, post.id],
                                    }))
                                  }
                                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#517a63] focus:ring-[#517a63]"
                                />
                                <div>
                                  <div className="font-medium text-gray-800">{post.title || 'Без названия'}</div>
                                  <div className="text-sm text-gray-500">/blog/{post.slug || 'slug'}</div>
                                </div>
                              </label>
                            )
                          })}
                        {blog.posts.filter((post) => post.id !== selectedPost.id).length === 0 ? (
                          <div className="text-sm text-gray-400">Сначала создайте еще хотя бы одну статью.</div>
                        ) : null}
                      </div>
                    </Field>
                  </div>
                </FormSection>

                <FormSection
                  title="Призыв к действию"
                  description="Этот блок мягко ведет читателя к записи, консультации или другой ключевой странице."
                >
                  <Input
                    label="Заголовок CTA"
                    value={selectedPost.cta.title}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        cta: {
                          ...currentPost.cta,
                          title: event.target.value,
                        },
                      }))
                    }
                    placeholder="Если тема откликается, это можно обсудить на консультации"
                  />
                  <Textarea
                    label="Текст CTA"
                    value={selectedPost.cta.description}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        cta: {
                          ...currentPost.cta,
                          description: event.target.value,
                        },
                      }))
                    }
                    rows={3}
                    placeholder="Коротко и по-человечески объясните, зачем перейти дальше."
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Текст кнопки"
                      value={selectedPost.cta.label}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          cta: {
                            ...currentPost.cta,
                            label: event.target.value,
                          },
                        }))
                      }
                      placeholder="Записаться на консультацию"
                    />
                    <Input
                      label="Ссылка кнопки"
                      value={selectedPost.cta.href}
                      onChange={(event) =>
                        updatePost(selectedPost.id, (currentPost) => ({
                          ...currentPost,
                          cta: {
                            ...currentPost.cta,
                            href: event.target.value,
                          },
                        }))
                      }
                      placeholder="/contact"
                      hint="Можно указать /contact, /pricing, /services#anxiety и т.д."
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Содержание статьи"
                  description="Добавляйте блоки по порядку: абзацы, подзаголовки, списки, цитаты и изображения."
                >
                  <InfoTip>
                    Для выделения текста используйте кнопки «Жирный», «Курсив» и «Ссылка». Вам не нужно помнить разметку — достаточно выделить текст и нажать кнопку.
                  </InfoTip>

                  <BlogBlocksEditor
                    blocks={selectedPost.content}
                    onChange={(blocks) =>
                      updatePost(selectedPost.id, (currentPost) => ({
                        ...currentPost,
                        content: blocks,
                      }))
                    }
                  />
                </FormSection>

                <div className="flex flex-wrap gap-3">
                  {selectedPost.status === 'published' && selectedPost.slug ? (
                    <Link
                      href={`/blog/${selectedPost.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      Открыть статью на сайте
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                      Предпросмотр опубликованной ссылки появится после сохранения статьи со статусом «Опубликовано».
                    </div>
                  )}
                </div>

                <BlogPreview
                  post={selectedPost}
                  authorName={specialistName}
                  authorTitle={specialistTitle}
                  authorMeta={specialistMeta}
                  relatedServices={previewRelatedServices}
                  relatedPages={previewRelatedPages}
                />
              </>
            ) : (
              <FormSection
                title="Выберите статью"
                description="Сначала откройте материал слева или создайте новый."
              >
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
                  Здесь появятся поля статьи, редактор блоков и предпросмотр.
                </div>
              </FormSection>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
