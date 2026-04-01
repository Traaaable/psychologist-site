import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getConsultationFormatLabel, getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Обо мне',
    description:
      'О специалисте: образование, подход к работе, опыт и ценности. Подробнее о формате психологической помощи.',
    path: '/about',
    pageKey: 'about',
  })
}

export default function AboutPage() {
  const content = getContent()
  const { specialist, about, education, certificates, services, location } = content

  const visibleServicesCount = services.filter(service => service.visible).length
  const consultationFormat = getConsultationFormatLabel(location.consultationFormat)
  const addressLabel = location.showAddress && location.address
    ? `${location.city}, ${location.address}`
    : location.city

  return (
    <>
      <section className="page-hero px-4 py-14 md:py-20">
        <div className="section-shell relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Обо мне' }]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="eyebrow">
                <span>О специалисте</span>
              </span>

              <span className="meta-pill">{specialist.title || 'Психолог'}</span>

              <h1 className="text-[3rem] leading-[0.96] text-[var(--color-stone-800)] md:text-[4.1rem]">
                {specialist.name || specialist.shortName || 'Психолог'}
              </h1>

              {specialist.tagline && (
                <p className="text-lg text-[var(--color-sage-700)] italic md:text-xl">
                  {specialist.tagline}
                </p>
              )}

              {about.mainText && (
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-stone-500)]">
                  {about.mainText}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button href="/contact" size="lg">
                  Записаться на консультацию
                </Button>
                <Button href="/how-it-works" variant="secondary" size="lg">
                  Как проходят сессии
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-sage-300)] to-[var(--color-cream-200)] rounded-3xl opacity-30 blur-2xl" aria-hidden="true" />

              <div className="relative w-80 h-[460px] rounded-3xl bg-[var(--color-cream-200)] overflow-hidden shadow-lg border border-[var(--color-stone-100)] border-opacity-50">
                {specialist.photo ? (
                  <img src={specialist.photo} alt={specialist.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--color-stone-400)]">
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} opacity="60">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-5 -right-3 md:-bottom-6 md:-right-4 bg-white rounded-2xl px-4 md:px-5 py-3 md:py-4 shadow-[var(--shadow-card)] border border-[var(--color-stone-100)] backdrop-blur-sm">
                <div className="font-serif text-2xl md:text-3xl text-[var(--color-accent)] font-semibold">
                  {specialist.experience || 'Опыт уточняется'}
                </div>
                <div className="text-xs text-[var(--color-stone-400)] mt-0.5">опыта работы</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              {about.approach && (
                <div>
                  <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-6 leading-tight">
                    Мой подход к работе
                  </h2>
                  <p className="text-[var(--color-stone-500)] leading-relaxed whitespace-pre-line">
                    {about.approach}
                  </p>
                </div>
              )}

              {about.values && (
                <div>
                  <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-6 leading-tight">
                    Что важно для меня в работе
                  </h2>
                  <p className="text-[var(--color-stone-500)] leading-relaxed whitespace-pre-line">
                    {about.values}
                  </p>
                </div>
              )}

              {about.quote && (
                <blockquote className="quote-block">
                  «{about.quote}»
                </blockquote>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {specialist.experience && (
                <div className="bg-[var(--color-cream-100)] rounded-2xl p-5 text-center">
                  <div className="font-serif text-3xl text-[var(--color-stone-800)] mb-1">
                    {specialist.experience}
                  </div>
                  <div className="text-xs text-[var(--color-stone-400)]">практики</div>
                </div>
              )}

              {specialist.sessionsCount && (
                <div className="bg-[var(--color-cream-100)] rounded-2xl p-5 text-center">
                  <div className="font-serif text-3xl text-[var(--color-stone-800)] mb-1">
                    {specialist.sessionsCount}
                  </div>
                  <div className="text-xs text-[var(--color-stone-400)]">консультаций</div>
                </div>
              )}

              <div className="bg-[var(--color-cream-100)] rounded-2xl p-5 text-center">
                <div className="font-serif text-3xl text-[var(--color-stone-800)] mb-1">
                  {visibleServicesCount || '0'}
                </div>
                <div className="text-xs text-[var(--color-stone-400)]">направлений помощи</div>
              </div>

              <div className="bg-[var(--color-cream-100)] rounded-2xl p-5 text-center">
                <div className="font-serif text-xl text-[var(--color-stone-800)] mb-1">
                  {consultationFormat}
                </div>
                <div className="text-xs text-[var(--color-stone-400)]">{addressLabel || 'Формат уточняется'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {education.length > 0 && (
        <section className="py-20 px-4 bg-[var(--color-cream-100)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-12">
              Образование и практика
            </h2>

            <div className="space-y-6">
              {education.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 bg-white rounded-2xl p-6 border border-[var(--color-stone-100)] shadow-[var(--shadow-soft)]"
                >
                  <div className="flex-shrink-0 w-24 text-sm font-medium text-[var(--color-sage-600)] pt-0.5">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-stone-800)] mb-1">
                      {item.institution}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-[var(--color-stone-500)]">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-12">
              Сертификаты и дополнительное обучение
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((item) => (
                <div key={item.id} className="bg-[var(--color-sage-100)] rounded-2xl p-7">
                  <div className="text-xs uppercase tracking-wider text-[var(--color-sage-700)] mb-3">
                    {item.year}
                  </div>
                  <h3 className="font-semibold text-[var(--color-stone-800)] mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-[var(--color-stone-500)] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Хотите познакомиться?"
        subtitle="Первая встреча — это просто разговор. Без обязательств и давления."
      />
    </>
  )
}
