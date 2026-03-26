import { load, type CheerioAPI } from 'cheerio'
import type { AnyNode, Element } from 'domhandler'
import {
  createBlockId,
  type BlogContentBlock,
  type BlogHtmlBlock,
  type BlogImageBlock,
  type BlogListBlock,
  type BlogQuoteBlock,
} from '@/lib/blog-schema'
import { storeB17Image } from '@/lib/blog-import/image-storage'
import {
  normalizeAbsoluteUrl,
  normalizeWhitespace,
  stripHtml,
} from '@/lib/blog-import/shared'

const DANGEROUS_TAGS = 'script,style,iframe,object,embed,form,input,button,textarea,select,meta,link'
const INLINE_TAGS = new Set(['a', 'strong', 'b', 'em', 'i', 'u', 'span', 'small', 'mark', 'sup', 'sub'])
const BLOCK_TAGS = new Set(['p', 'div', 'section', 'article'])

function isElement(node: AnyNode): node is Element {
  return node.type === 'tag'
}

function normalizeInlineText(value: string) {
  return normalizeWhitespace(value).replace(/\s+([,.;:!?])/g, '$1')
}

function renderPlainText($: CheerioAPI, nodes: AnyNode[]): string {
  return normalizeWhitespace(
    nodes
      .map((node) => {
        if (node.type === 'text') {
          return node.data
        }

        if (isElement(node)) {
          return renderPlainText($, node.children || [])
        }

        return ''
      })
      .join(' ')
  )
}

function renderInlineNodes($: CheerioAPI, nodes: AnyNode[], baseUrl: string): string {
  const parts: string[] = []

  for (const node of nodes) {
    if (node.type === 'text') {
      parts.push(node.data)
      continue
    }

    if (!isElement(node)) {
      continue
    }

    const tag = node.name.toLowerCase()

    if (tag === 'br') {
      parts.push(' ')
      continue
    }

    if (tag === 'a') {
      const href = normalizeAbsoluteUrl($(node).attr('href') || '', baseUrl)
      const label = renderPlainText($, node.children || [])

      if (href && label) {
        parts.push(`[${label}](${href})`)
        continue
      }
    }

    if (tag === 'strong' || tag === 'b') {
      const text = renderInlineNodes($, node.children || [], baseUrl)

      if (text) {
        parts.push(`**${text}**`)
      }
      continue
    }

    if (tag === 'em' || tag === 'i') {
      const text = renderInlineNodes($, node.children || [], baseUrl)

      if (text) {
        parts.push(`*${text}*`)
      }
      continue
    }

    parts.push(renderInlineNodes($, node.children || [], baseUrl))
  }

  return normalizeInlineText(parts.join(' '))
}

function sanitizeFragment(html: string, baseUrl: string) {
  const $ = load(`<root>${html}</root>`)

  $(DANGEROUS_TAGS).remove()

  $('*').each((_, element) => {
    if (!isElement(element)) {
      return
    }

    const tag = element.name.toLowerCase()
    const attributes = { ...element.attribs }

    for (const [name, value] of Object.entries(attributes)) {
      if (name.toLowerCase().startsWith('on')) {
        $(element).removeAttr(name)
        continue
      }

      if (tag === 'a' && name === 'href') {
        const href = normalizeAbsoluteUrl(value, baseUrl)

        if (href && !href.toLowerCase().startsWith('javascript:')) {
          $(element).attr('href', href)
          continue
        }

        $(element).removeAttr(name)
        continue
      }

      if (tag === 'img' && name === 'src') {
        const src = normalizeAbsoluteUrl(value, baseUrl)

        if (src) {
          $(element).attr('src', src)
          continue
        }
      }

      if (
        (tag === 'a' && ['href', 'title', 'target', 'rel'].includes(name)) ||
        (tag === 'img' && ['src', 'alt', 'title'].includes(name))
      ) {
        continue
      }

      $(element).removeAttr(name)
    }
  })

  return $('root').html() || ''
}

async function createImageBlock($: CheerioAPI, node: Element, baseUrl: string) {
  const rawSource = $(node).attr('src') || $(node).attr('src_defer') || ''
  const sourceUrl = normalizeAbsoluteUrl(rawSource, baseUrl)

  if (!sourceUrl) {
    return {
      block: null,
      warnings: ['Не удалось определить URL изображения в статье B17'],
    }
  }

  const storedImage = await storeB17Image(sourceUrl)
  const alt = normalizeWhitespace($(node).attr('alt') || $(node).attr('title') || '')
  const caption = normalizeWhitespace($(node).attr('title') || '')
  const imageBlock: BlogImageBlock = {
    id: createBlockId('image'),
    type: 'image',
    src: storedImage.src || sourceUrl,
    alt,
    caption: caption && caption !== alt ? caption : undefined,
  }

  return {
    block: imageBlock,
    warnings: storedImage.error ? [storedImage.error] : [],
  }
}

async function convertList($: CheerioAPI, node: Element, baseUrl: string) {
  const items = $(node)
    .children('li')
    .map((_, item) => renderInlineNodes($, item.children || [], baseUrl))
    .get()
    .map((item) => normalizeInlineText(item))
    .filter(Boolean)

  if (items.length === 0) {
    return null
  }

  const listBlock: BlogListBlock = {
    id: createBlockId('list'),
    type: 'list',
    style: node.name.toLowerCase() === 'ol' ? 'ordered' : 'unordered',
    items,
  }

  return listBlock
}

async function convertQuote($: CheerioAPI, node: Element, baseUrl: string) {
  const cite = $(node).find('cite').first()
  const author = normalizeWhitespace(cite.text())

  if (cite.length > 0) {
    cite.remove()
  }

  const text = renderInlineNodes($, node.children || [], baseUrl)

  if (!text) {
    return null
  }

  const quoteBlock: BlogQuoteBlock = {
    id: createBlockId('quote'),
    type: 'quote',
    text,
    author: author || undefined,
  }

  return quoteBlock
}

async function convertContainer(
  $: CheerioAPI,
  nodes: AnyNode[],
  baseUrl: string
): Promise<{ blocks: BlogContentBlock[]; warnings: string[] }> {
  const blocks: BlogContentBlock[] = []
  const warnings: string[] = []
  let paragraphBuffer = ''

  const flushParagraph = () => {
    const text = normalizeInlineText(paragraphBuffer)

    if (text) {
      blocks.push({
        id: createBlockId('paragraph'),
        type: 'paragraph',
        text,
      })
    }

    paragraphBuffer = ''
  }

  for (const node of nodes) {
    if (node.type === 'text') {
      paragraphBuffer += ` ${node.data}`
      continue
    }

    if (!isElement(node)) {
      continue
    }

    const tag = node.name.toLowerCase()

    if (INLINE_TAGS.has(tag)) {
      paragraphBuffer += ` ${renderInlineNodes($, [node], baseUrl)}`
      continue
    }

    if (tag === 'img') {
      flushParagraph()
      const imageResult = await createImageBlock($, node, baseUrl)

      if (imageResult.block) {
        blocks.push(imageResult.block)
      }

      warnings.push(...imageResult.warnings)
      continue
    }

    if (tag === 'br') {
      paragraphBuffer += ' '
      continue
    }

    if (tag === 'hr') {
      flushParagraph()
      blocks.push({
        id: createBlockId('divider'),
        type: 'divider',
      })
      continue
    }

    if (tag === 'blockquote') {
      flushParagraph()
      const quoteBlock = await convertQuote($, node, baseUrl)

      if (quoteBlock) {
        blocks.push(quoteBlock)
      }
      continue
    }

    if (tag === 'ul' || tag === 'ol') {
      flushParagraph()
      const listBlock = await convertList($, node, baseUrl)

      if (listBlock) {
        blocks.push(listBlock)
      }
      continue
    }

    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
      flushParagraph()
      const text = renderInlineNodes($, node.children || [], baseUrl)

      if (text) {
        blocks.push({
          id: createBlockId('heading'),
          type: 'heading',
          text,
          level: tag === 'h3' || tag === 'h4' ? 3 : 2,
        })
      }
      continue
    }

    if (tag === 'p' || BLOCK_TAGS.has(tag)) {
      flushParagraph()
      const nestedResult = await convertContainer($, node.children || [], baseUrl)

      if (nestedResult.blocks.length === 0) {
        const fallbackText = renderInlineNodes($, node.children || [], baseUrl)

        if (fallbackText) {
          blocks.push({
            id: createBlockId('paragraph'),
            type: 'paragraph',
            text: fallbackText,
          })
        }
      } else {
        blocks.push(...nestedResult.blocks)
      }

      warnings.push(...nestedResult.warnings)
      continue
    }

    flushParagraph()
    const nestedResult = await convertContainer($, node.children || [], baseUrl)

    if (nestedResult.blocks.length > 0) {
      blocks.push(...nestedResult.blocks)
      warnings.push(...nestedResult.warnings)
      continue
    }

    const rawHtml = ($(node).toString() || '').trim()
    const rawText = stripHtml(rawHtml)

    if (rawText) {
      const htmlBlock: BlogHtmlBlock = {
        id: createBlockId('html'),
        type: 'html',
        html: rawHtml,
      }
      blocks.push(htmlBlock)
    }
  }

  flushParagraph()

  return {
    blocks,
    warnings,
  }
}

export async function convertHtmlToBlocks(html: string, baseUrl: string) {
  const sanitizedHtml = sanitizeFragment(html, baseUrl)
  const $ = load(`<root>${sanitizedHtml}</root>`)
  const result = await convertContainer($, $('root').contents().toArray(), baseUrl)

  return {
    blocks: result.blocks,
    sanitizedHtml,
    warnings: [...new Set(result.warnings)].filter(Boolean),
  }
}
