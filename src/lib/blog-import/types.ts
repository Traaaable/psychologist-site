import type {
  B17PublicationType,
  BlogContentBlock,
  BlogImportRun,
  BlogImportSource,
  BlogImportStatus,
} from '@/lib/blog-schema'

export interface ExternalArticleListItem {
  source: BlogImportSource
  sourceType: B17PublicationType
  title: string
  url: string
  originalId?: string
  originalPublishedAt?: string
  dateLabel?: string
  excerpt?: string
  coverImage?: string
  coverAlt?: string
  isPinned?: boolean
  category?: string
  tags?: string[]
}

export interface ExternalArticlePayload extends ExternalArticleListItem {
  sourceTitle: string
  sourceExcerpt: string
  sourceHtml?: string
  contentBlocks: BlogContentBlock[]
  warnings?: string[]
}

export interface ExternalListResult {
  items: ExternalArticleListItem[]
  strategy: string
  pageCount: number
  warnings: string[]
}

export interface ImportCandidatePreview extends ExternalArticleListItem {
  status: 'new' | 'existing'
  matchedPostId?: string
  matchedPostTitle?: string
  importStatus?: BlogImportStatus
}

export interface ImportOperationResult {
  changed: boolean
  postId: string
  slug: string
  action: 'created' | 'updated' | 'skipped'
  title: string
  originalUrl: string
  warnings?: string[]
}

export interface ImportExecutionResult {
  run: BlogImportRun
  previewItems?: ImportCandidatePreview[]
  operations: ImportOperationResult[]
}
