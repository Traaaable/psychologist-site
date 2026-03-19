import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { FooterWrapper } from '@/components/layout/FooterWrapper'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

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
    <html lang="ru" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body
        className="bg-[var(--color-cream-50)] text-[var(--color-stone-800)] antialiased"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        <HeaderWrapper />
        <main id="main-content" className="pt-16 md:pt-20">
          {children}
        </main>
        <FooterWrapper />
      </body>
    </html>
  )
}
