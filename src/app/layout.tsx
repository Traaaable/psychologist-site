import type { Metadata } from 'next'
import './globals.css'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { FooterWrapper } from '@/components/layout/FooterWrapper'

export const dynamic = 'force-dynamic'

// Метаданные генерируются динамически из контента
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { getContent } = await import('@/lib/content')
    const content = getContent()
    return {
      metadataBase: new URL(content.seo.siteUrl || 'http://localhost:3000'),
      title: {
        default: content.seo.pages.home?.title || content.seo.siteName,
        template: `%s | ${content.specialist.shortName || content.specialist.name}`,
      },
      description: content.seo.pages.home?.description || content.seo.defaultDescription,
      robots: { index: true, follow: true },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        siteName: content.seo.siteName,
      },
    }
  } catch {
    return {
      title: 'Психолог',
      description: 'Индивидуальные консультации психолога',
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Загружаем контент для Schema.org
  let schemaName = 'Психолог'
  let schemaCity = 'Россия'
  let schemaPhone = ''
  let schemaEmail = ''

  try {
    const { getContent } = await import('@/lib/content')
    const content = getContent()
    schemaName = content.specialist.name
    schemaCity = content.location.city
    schemaPhone = content.contacts.phone
    schemaEmail = content.contacts.email
  } catch { /* файл ещё не создан */ }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: schemaName,
    jobTitle: 'Психолог',
    telephone: schemaPhone,
    email: schemaEmail,
    address: { '@type': 'PostalAddress', addressLocality: schemaCity, addressCountry: 'RU' },
  }

  return (
    <html lang="ru">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-stone-800)] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--color-sage-800)] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Перейти к содержимому
        </a>
        <HeaderWrapper />
        <main id="main-content" className="pt-20 md:pt-24">
          {children}
        </main>
        <FooterWrapper />
      </body>
    </html>
  )
}
