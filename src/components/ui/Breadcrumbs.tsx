import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Schema.org разметка для хлебных крошек (SEO)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://anna-sokolova.ru${item.href}` : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Хлебные крошки" className={`flex items-center gap-2 text-sm text-[var(--color-stone-400)] ${className}`}>
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-[var(--color-sage-600)] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--color-stone-600)]" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
