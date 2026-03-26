'use client'

import { useRef } from 'react'
import {
  Field,
  Input,
  ListCard,
  Select,
  Textarea,
} from '@/components/admin/AdminForm'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import {
  createBlockId,
  type BlogContentBlock,
  type BlogDividerBlock,
  type BlogHeadingBlock,
  type BlogHtmlBlock,
  type BlogImageBlock,
  type BlogListBlock,
  type BlogParagraphBlock,
  type BlogQuoteBlock,
} from '@/lib/blog-schema'

interface BlogBlocksEditorProps {
  blocks: BlogContentBlock[]
  onChange: (blocks: BlogContentBlock[]) => void
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) {
    return items
  }

  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function getBlockTitle(block: BlogContentBlock) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? 'Подзаголовок H2' : 'Подзаголовок H3'
    case 'list':
      return block.style === 'ordered' ? 'Нумерованный список' : 'Маркированный список'
    case 'quote':
      return 'Цитата'
    case 'image':
      return 'Изображение'
    case 'divider':
      return 'Разделитель'
    case 'html':
      return 'HTML fallback'
    default:
      return 'Абзац'
  }
}

function getBlockSubtitle(block: BlogContentBlock) {
  if (block.type === 'list') {
    return block.items[0] || 'Каждый пункт будет с новой строки'
  }

  if (block.type === 'image') {
    return block.caption || block.alt || 'Загрузите изображение и подпись'
  }

  if (block.type === 'quote') {
    return block.text || 'Выделенная мысль или цитата'
  }

  if (block.type === 'divider') {
    return 'Тонкая линия между смысловыми частями статьи'
  }

  if (block.type === 'html') {
    return block.html || 'Резервный блок для сложной разметки'
  }

  return block.text || 'Введите текст блока'
}

function RichTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  hint?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const wrapSelection = (before: string, after: string, fallback = 'текст') => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || fallback
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`

    onChange(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const selectionStart = start + before.length
      const selectionEnd = selectionStart + selected.length
      textarea.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  const insertLink = () => {
    const href = window.prompt(
      'Куда должна вести ссылка? Можно вставить адрес страницы сайта, например /contact или /services#anxiety',
      '/contact'
    )

    if (!href) {
      return
    }

    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? value.length
    const end = textarea?.selectionEnd ?? value.length
    const selected = value.slice(start, end) || 'текст ссылки'
    const nextValue = `${value.slice(0, start)}[${selected}](${href})${value.slice(end)}`

    onChange(nextValue)

    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + 1, start + 1 + selected.length)
    })
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => wrapSelection('**', '**')}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Жирный
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('*', '*')}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Курсив
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Ссылка
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base transition focus:border-[#517a63] focus:outline-none focus:ring-2 focus:ring-[#517a63]/40"
        />
      </div>
    </Field>
  )
}

export function BlogBlocksEditor({ blocks, onChange }: BlogBlocksEditorProps) {
  const updateBlock = <T extends BlogContentBlock>(blockId: string, updater: (block: T) => T) => {
    onChange(
      blocks.map((block) =>
        block.id === blockId ? updater(block as T) : block
      )
    )
  }

  const deleteBlock = (blockId: string) => {
    onChange(blocks.filter((block) => block.id !== blockId))
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    onChange(moveItem(blocks, index, index + direction))
  }

  const addBlock = (type: BlogContentBlock['type']) => {
    const baseBlock =
      type === 'heading'
        ? ({
            id: createBlockId('heading'),
            type: 'heading',
            text: '',
            level: 2,
          } satisfies BlogHeadingBlock)
        : type === 'list'
          ? ({
              id: createBlockId('list'),
              type: 'list',
              style: 'unordered',
              items: [''],
            } satisfies BlogListBlock)
          : type === 'quote'
            ? ({
                id: createBlockId('quote'),
                type: 'quote',
                text: '',
                author: '',
              } satisfies BlogQuoteBlock)
            : type === 'image'
              ? ({
                  id: createBlockId('image'),
                  type: 'image',
                  src: '',
                  alt: '',
                  caption: '',
                } satisfies BlogImageBlock)
              : type === 'divider'
                ? ({
                    id: createBlockId('divider'),
                    type: 'divider',
                  } satisfies BlogDividerBlock)
                : type === 'html'
                  ? ({
                      id: createBlockId('html'),
                      type: 'html',
                      html: '',
                    } satisfies BlogHtmlBlock)
                  : ({
                      id: createBlockId('paragraph'),
                      type: 'paragraph',
                      text: '',
                    } satisfies BlogParagraphBlock)

    onChange([...blocks, baseBlock])
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <ListCard
          key={block.id}
          title={getBlockTitle(block)}
          subtitle={getBlockSubtitle(block)}
          onDelete={() => deleteBlock(block.id)}
          onMoveUp={index > 0 ? () => moveBlock(index, -1) : undefined}
          onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, 1) : undefined}
          isExpanded
        >
          <div className="space-y-4">
            {block.type === 'paragraph' ? (
              <RichTextarea
                label="Текст абзаца"
                value={block.text}
                onChange={(value) =>
                  updateBlock<BlogParagraphBlock>(block.id, (currentBlock) => ({
                    ...currentBlock,
                    text: value,
                  }))
                }
                placeholder="Введите основной текст абзаца"
                hint="Можно просто писать обычный текст. Для выделения используйте кнопки сверху."
              />
            ) : null}

            {block.type === 'heading' ? (
              <>
                <Select
                  label="Уровень подзаголовка"
                  value={String(block.level)}
                  onChange={(event) =>
                    updateBlock<BlogHeadingBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      level: event.target.value === '3' ? 3 : 2,
                    }))
                  }
                  options={[
                    { value: '2', label: 'H2 — основной подзаголовок' },
                    { value: '3', label: 'H3 — вложенный подзаголовок' },
                  ]}
                />
                <Input
                  label="Текст подзаголовка"
                  value={block.text}
                  onChange={(event) =>
                    updateBlock<BlogHeadingBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      text: event.target.value,
                    }))
                  }
                  placeholder="Например: Когда стоит обратиться за помощью"
                />
              </>
            ) : null}

            {block.type === 'list' ? (
              <>
                <Select
                  label="Вид списка"
                  value={block.style}
                  onChange={(event) =>
                    updateBlock<BlogListBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      style: event.target.value === 'ordered' ? 'ordered' : 'unordered',
                    }))
                  }
                  options={[
                    { value: 'unordered', label: 'С маркерами' },
                    { value: 'ordered', label: 'С номерами' },
                  ]}
                />
                <RichTextarea
                  label="Пункты списка"
                  value={block.items.join('\n')}
                  onChange={(value) =>
                    updateBlock<BlogListBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      items: value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder={'Первый пункт\nВторой пункт\nТретий пункт'}
                  rows={5}
                  hint="Каждый пункт начинается с новой строки."
                />
              </>
            ) : null}

            {block.type === 'quote' ? (
              <>
                <RichTextarea
                  label="Текст цитаты"
                  value={block.text}
                  onChange={(value) =>
                    updateBlock<BlogQuoteBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      text: value,
                    }))
                  }
                  placeholder="Введите цитату или важную мысль"
                  rows={4}
                />
                <Input
                  label="Подпись к цитате"
                  value={block.author || ''}
                  onChange={(event) =>
                    updateBlock<BlogQuoteBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      author: event.target.value,
                    }))
                  }
                  placeholder="Например: Лариса Нестерова"
                />
              </>
            ) : null}

            {block.type === 'image' ? (
              <>
                <ImageUploadField
                  label="Изображение внутри статьи"
                  value={block.src}
                  onChange={(url) =>
                    updateBlock<BlogImageBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      src: url,
                    }))
                  }
                  altValue={block.alt}
                  onAltChange={(value) =>
                    updateBlock<BlogImageBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      alt: value,
                    }))
                  }
                  hint="Можно вставить ссылку вручную или загрузить картинку с компьютера."
                />
                <Textarea
                  label="Подпись под изображением"
                  value={block.caption || ''}
                  onChange={(event) =>
                    updateBlock<BlogImageBlock>(block.id, (currentBlock) => ({
                      ...currentBlock,
                      caption: event.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Короткое пояснение под изображением"
                />
              </>
            ) : null}

            {block.type === 'divider' ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                Разделитель помогает аккуратно отделить одну смысловую часть статьи от другой.
              </div>
            ) : null}

            {block.type === 'html' ? (
              <Textarea
                label="HTML fallback"
                value={block.html}
                onChange={(event) =>
                  updateBlock<BlogHtmlBlock>(block.id, (currentBlock) => ({
                    ...currentBlock,
                    html: event.target.value,
                  }))
                }
                rows={8}
                placeholder="<div>Сложный фрагмент, который пока нельзя выразить обычными блоками</div>"
                hint="Используйте только для редких сложных случаев. Основной контент лучше хранить обычными блоками."
              />
            ) : null}
          </div>
        </ListCard>
      ))}

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <div className="text-sm font-medium text-gray-700">Добавить блок статьи</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Абзац
          </button>
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Подзаголовок
          </button>
          <button
            type="button"
            onClick={() => addBlock('list')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Список
          </button>
          <button
            type="button"
            onClick={() => addBlock('quote')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Цитата
          </button>
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Изображение
          </button>
          <button
            type="button"
            onClick={() => addBlock('divider')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            Разделитель
          </button>
          <button
            type="button"
            onClick={() => addBlock('html')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-[#517a63] hover:text-[#517a63]"
          >
            HTML fallback
          </button>
        </div>
      </div>
    </div>
  )
}
