import type { ReactNode } from 'react'
import Link from 'next/link'
import type { BlogContentBlock } from '@/lib/blog-schema'

interface BlogBlocksProps {
  blocks: BlogContentBlock[]
  className?: string
}

function renderTextSegment(text: string, keyPrefix: string) {
  const parts: ReactNode[] = []
  const pattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]

    if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const [, label, href] = linkMatch
        const isExternal = /^https?:\/\//.test(href)
        parts.push(
          isExternal ? (
            <a
              key={`${keyPrefix}-${match.index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="prose-link"
            >
              {label}
            </a>
          ) : (
            <Link
              key={`${keyPrefix}-${match.index}`}
              href={href}
              className="prose-link"
            >
              {label}
            </Link>
          )
        )
      }
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-${match.index}`} className="font-semibold text-[var(--color-stone-800)]">
          {token.slice(2, -2)}
        </strong>
      )
    } else {
      parts.push(
        <em key={`${keyPrefix}-${match.index}`} className="italic text-[var(--color-stone-700)]">
          {token.slice(1, -1)}
        </em>
      )
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export function renderInlineContent(text: string, keyPrefix = 'inline') {
  return renderTextSegment(text, keyPrefix)
}

export function BlogBlocks({ blocks, className = '' }: BlogBlocksProps) {
  return (
    <div className={`space-y-7 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const commonClass =
            block.level === 2
              ? 'font-serif text-[2.2rem] md:text-[3rem] text-[var(--color-stone-800)] pt-8'
              : 'font-serif text-[1.8rem] md:text-[2.2rem] text-[var(--color-stone-800)] pt-6'

          if (block.level === 3) {
            return (
              <h3 key={block.id || index} className={commonClass}>
                {renderInlineContent(block.text, `heading-${index}`)}
              </h3>
            )
          }

          return (
            <h2 key={block.id || index} className={commonClass}>
              {renderInlineContent(block.text, `heading-${index}`)}
            </h2>
          )
        }

        if (block.type === 'list') {
          const ListTag = block.style === 'ordered' ? 'ol' : 'ul'

          return (
            <ListTag
              key={block.id || index}
              className={`space-y-3 pl-6 text-[var(--color-stone-600)] ${
                block.style === 'ordered' ? 'list-decimal marker:text-[var(--color-sage-600)]' : 'list-disc marker:text-[var(--color-sage-600)]'
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${block.id || index}-${itemIndex}`} className="pl-1 leading-8 md:text-lg">
                  {renderInlineContent(item, `list-${index}-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          )
        }

        if (block.type === 'quote') {
          return (
            <figure
              key={block.id || index}
              className="rounded-3xl border border-[var(--color-stone-200)] bg-[var(--color-cream-100)] px-6 py-6 md:px-8"
            >
              <blockquote className="quote-block pl-5 text-lg md:text-xl">
                {renderInlineContent(block.text, `quote-${index}`)}
              </blockquote>
              {block.author ? (
                <figcaption className="mt-4 text-sm font-medium text-[var(--color-stone-500)]">
                  {block.author}
                </figcaption>
              ) : null}
            </figure>
          )
        }

        if (block.type === 'image') {
          if (!block.src) {
            return null
          }

          return (
            <figure key={block.id || index} className="space-y-3">
              <div className="overflow-hidden rounded-3xl border border-[var(--color-stone-200)] bg-[var(--color-stone-100)]">
                <img
                  src={block.src}
                  alt={block.alt || ''}
                  className="h-auto w-full object-cover"
                />
              </div>
              {block.caption ? (
                <figcaption className="text-sm leading-relaxed text-[var(--color-stone-400)]">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          )
        }

        if (block.type === 'divider') {
          return (
            <div key={block.id || index} className="py-2">
              <hr className="border-0 border-t border-[var(--color-stone-200)]" />
            </div>
          )
        }

        if (block.type === 'html') {
          return (
            <div
              key={block.id || index}
              className="overflow-hidden rounded-3xl border border-[var(--color-stone-200)] bg-[var(--color-stone-100)] px-5 py-5 text-[var(--color-stone-600)] shadow-[var(--shadow-soft)] [&_a]:text-[var(--color-sage-700)] [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-sage-300)] [&_blockquote]:pl-4 [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--color-stone-200)] [&_img]:shadow-[var(--shadow-soft)] [&_li]:leading-8 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:leading-8 [&_p:not(:first-child)]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          )
        }

        return (
          <p
            key={block.id || index}
            className="text-base leading-8 text-[var(--color-stone-600)] md:text-[1.12rem]"
          >
            {renderInlineContent(block.text, `paragraph-${index}`)}
          </p>
        )
      })}
    </div>
  )
}
