import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-schema'
import { formatBlogDate, getBlogReadTime } from '@/lib/blog-utils'

interface BlogCardProps {
  post: BlogPost
  priority?: boolean
}

function CoverPlaceholder({ title, category }: { title: string; category: string }) {
  return (
    <div className="flex h-full min-h-64 flex-col justify-end bg-[radial-gradient(circle_at_top_left,_rgba(113,136,113,0.22),_transparent_42%),linear-gradient(160deg,_var(--color-cream-100),_white_68%,_var(--color-sage-100))] p-7">
      {category ? <span className="badge badge-sage mb-4 self-start">{category}</span> : null}
      <div className="font-serif text-[2.15rem] leading-[1.04] text-[var(--color-stone-800)]">
        {title}
      </div>
    </div>
  )
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="panel-strong group h-full overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <CoverPlaceholder title={post.title} category={post.category} />
          )}
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[var(--color-stone-400)]">
            {post.category ? <span className="badge badge-sage">{post.category}</span> : null}
            <span>{formatBlogDate(post.publishedAt || post.updatedAt)}</span>
            <span>•</span>
            <span>{getBlogReadTime(post)} чтения</span>
          </div>

          <h2 className="mb-4 font-serif text-[2rem] leading-[1.05] text-[var(--color-stone-800)] transition-colors duration-200 group-hover:text-[var(--color-sage-700)]">
            {post.title}
          </h2>

          <p className="mb-6 flex-1 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
            {post.excerpt}
          </p>

          {post.tags.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--color-stone-100)] px-3 py-1 text-xs text-[var(--color-stone-500)]">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--color-sage-700)]">
            <span>Читать статью</span>
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
