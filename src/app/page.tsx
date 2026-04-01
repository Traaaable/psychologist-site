import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogCard } from '@/components/blog/BlogCard'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeOffer } from '@/components/home/HomeOffer'
import { HomeOverview } from '@/components/home/HomeOverview'
import { CTASection } from '@/components/sections/CTASection'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getPublishedBlogPosts } from '@/lib/blog'
import { getConsultationFormatLabel, getContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = getContent()
    return {
      title: content.seo.pages.home?.title,
      description: content.seo.pages.home?.description || content.seo.defaultDescription,
    }
  } catch {
    return { title: 'Психолог' }
  }
}

export default async function HomePage() {
  const content = getContent()
  const { specialist, contacts, location, about, services, pricing, faq } = content

  const visibleServices = services.filter((service) => service.visible)
  const visiblePricing = pricing.filter((plan) => plan.visible)
  const visibleFaq = faq
    .filter((item) => item.visible)
    .map((item, index) => ({ ...item, id: index + 1 }))
  const latestPosts = getPublishedBlogPosts(content).slice(0, 3)

  const formatLabel = getConsultationFormatLabel(location.consultationFormat)
  const locationDisplay =
    location.showAddress && location.address ? `${location.city}, ${location.address}` : location.city
  const sessionDuration = visiblePricing[0]?.duration || '50-60 минут'
  const mainRequests = visibleServices.slice(0, 4).map((service) => service.title)

  const trustCards = [
    {
      label: 'Опыт',
      value: specialist.experience || 'Опыт уточняется',
      description: 'Практика со взрослыми клиентами в индивидуальном формате.',
    },
    {
      label: 'Сессии',
      value: specialist.sessionsCount || 'Консультации',
      description: 'Работа с тревогой, выгоранием, отношениями и жизненными кризисами.',
    },
    {
      label: 'Формат',
      value: formatLabel,
      description: location.formatNote || 'Можно подобрать удобный способ встреч.',
    },
  ]

  return (
    <>
      <HomeHero
        specialist={specialist}
        location={location}
        formatLabel={formatLabel}
        locationDisplay={locationDisplay}
        mainRequests={mainRequests}
      />

      <HomeOverview about={about} services={visibleServices} trustCards={trustCards} />

      <HomeOffer
        contacts={contacts}
        location={location}
        formatLabel={formatLabel}
        locationDisplay={locationDisplay}
        pricing={visiblePricing}
        sessionDuration={sessionDuration}
      />

      {latestPosts.length > 0 ? (
        <section className="section-bg-warm section-space px-4">
          <div className="section-shell">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader
                label="Блог"
                title="Экспертные материалы, которые поддерживают доверие и помогают лучше понять свой запрос"
                subtitle="Блог встроен в общую структуру сайта не как отдельный модуль, а как продолжение профессионального диалога со специалистом."
                align="left"
                className="mb-0"
              />
              <Link href="/blog" className="btn-secondary self-start">
                Перейти в блог
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {visibleFaq.length > 0 ? (
        <section className="section-space px-4">
          <div className="section-shell">
            <div className="panel-strong px-6 py-8 md:px-8 md:py-10">
              <FAQAccordion
                items={visibleFaq}
                title="Вопросы, которые часто важно прояснить заранее"
                subtitle="Этот блок помогает снять неопределённость ещё до первой записи. Если вашего вопроса нет, можно написать напрямую."
                label="FAQ"
              />
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        title="Если хотите перейти от чтения к спокойному личному разговору"
        subtitle="Можно начать с короткой заявки без обязательств. На первой встрече мы просто разберёмся, что для вас сейчас важно."
      />
    </>
  )
}
