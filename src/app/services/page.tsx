import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

const iconMap: Record<string, React.ReactNode> = {
  wave: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 0 2-4 4-4s4 4 4 4 2-4 4-4 4 4 4 4" /></svg>,
  flame: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  heart: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  star: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  bolt: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  compass: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>,
}

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'С чем я работаю',
    description:
      'Направления психологической помощи: тревога, выгорание, отношения, самооценка, стресс и жизненные кризисы.',
    path: '/services',
    pageKey: 'services',
  })
}

export default function ServicesPage() {
  const services = getContent().services.filter(service => service.visible)

  return (
    <>
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'С чем я работаю' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Направления работы</span>
            </div>

            <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
              <span>{services.length} направлений помощи</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
              С чем я работаю
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
              Ниже собраны темы, с которыми я работаю чаще всего. Если не нашли своей ситуации —
              напишите, и мы вместе посмотрим, чем я могу быть полезна.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {services.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {services.map((service) => (
                  <a
                    key={service.id}
                    href={`#${service.id}`}
                    className="badge badge-sage text-sm hover:bg-[var(--color-sage-200)] transition-colors duration-200 cursor-pointer"
                  >
                    {service.title}
                  </a>
                ))}
              </div>

              <div className="space-y-8">
                {services.map((service) => (
                  <div
                    key={service.id}
                    id={service.id}
                    className="grid grid-cols-1 lg:grid-cols-[96px_minmax(0,1fr)] gap-6 bg-[var(--color-cream-100)] rounded-3xl p-8 scroll-mt-24"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white text-[var(--color-sage-600)] border border-[var(--color-stone-200)] flex items-center justify-center shadow-[var(--shadow-soft)]">
                      {iconMap[service.icon] || iconMap.star}
                    </div>

                    <div>
                      <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-3 leading-tight">
                        {service.title}
                      </h2>
                      {service.shortDesc && (
                        <p className="text-lg text-[var(--color-sage-600)] italic font-serif mb-5">
                          {service.shortDesc}
                        </p>
                      )}
                      {service.fullDesc && (
                        <p className="text-[var(--color-stone-500)] leading-relaxed mb-6 whitespace-pre-line">
                          {service.fullDesc}
                        </p>
                      )}
                      <Button href="/contact" variant="secondary">
                        Записаться
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto text-center bg-[var(--color-cream-100)] rounded-3xl p-10">
              <h2 className="font-serif text-3xl text-[var(--color-stone-800)] mb-4">
                Направления скоро появятся
              </h2>
              <p className="text-[var(--color-stone-500)] leading-relaxed">
                Сейчас раздел в процессе наполнения. Напишите мне напрямую, если хотите обсудить
                свой запрос.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Узнали свою ситуацию?"
        subtitle="Запишитесь на первую консультацию — разберёмся вместе."
      />
    </>
  )
}
