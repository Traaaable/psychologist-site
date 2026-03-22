import type { Metadata } from 'next'
import { getContent, getConsultationFormatLabel } from '@/lib/content'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { ContactForm } from '@/components/sections/ContactForm'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQAccordion } from '@/components/sections/FAQAccordion'

// Иконки для услуг
const ICON_MAP: Record<string, React.ReactNode> = {
  wave: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 0 2-4 4-4s4 4 4 4 2-4 4-4 4 4 4 4" /></svg>,
  flame: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  heart: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  star: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  bolt: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  compass: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>,
}

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

  const visibleServices = services.filter(s => s.visible)
  const visibleFaq = faq.filter(f => f.visible).map((f, i) => ({ ...f, id: i + 1 }))
  const visiblePricing = pricing.filter(p => p.visible)

  const locationDisplay = location.showAddress && location.address
    ? `${location.city}, ${location.address}`
    : location.city

  const formatLabel = getConsultationFormatLabel(location.consultationFormat)

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient min-h-[90vh] flex items-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative Blurred Backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(120 113 108) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} aria-hidden="true" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT COLUMN - CONTENT */}
            <div className="order-2 lg:order-1 space-y-8">
              {/* Accent Line */}
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Психологическая поддержка</span>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
                <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
                <span>{formatLabel}</span>
                {location.city && <span className="text-[var(--color-stone-400)]">·</span>}
                {location.city && <span>{location.city}</span>}
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
                  {specialist.heroText || 'Пространство, где можно быть собой'}
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed max-w-xl font-light">
                  {specialist.heroSubtitle}
                </p>
              </div>

              {/* Trust Indicators - Before CTAs */}
              <div className="grid grid-cols-3 gap-4 py-2 max-w-sm">
                {specialist.experience && (
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-[var(--color-accent)] font-semibold">{specialist.experience}</div>
                    <div className="text-xs text-[var(--color-stone-400)] mt-1 leading-snug">лет опыта</div>
                  </div>
                )}
                {specialist.sessionsCount && (
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-[var(--color-accent)] font-semibold">{specialist.sessionsCount}</div>
                    <div className="text-xs text-[var(--color-stone-400)] mt-1 leading-snug">сессий</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="font-serif text-lg md:text-xl text-[var(--color-accent)] font-semibold">
                    {location.consultationFormat === 'both' ? '2' :
                     location.consultationFormat === 'online' ? '1' : '1'}
                  </div>
                  <div className="text-xs text-[var(--color-stone-400)] mt-1 leading-snug">
                    {location.consultationFormat === 'both' ? 'формата' : 'формат'}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button href="/contact" size="lg" className="shadow-lg shadow-[var(--color-accent)]/10 hover:shadow-xl hover:shadow-[var(--color-accent)]/20 transition-all duration-300">
                  Записаться на консультацию
                </Button>
                <Button href="/about" variant="secondary" size="lg" className="border-2 border-[var(--color-stone-200)] hover:border-[var(--color-sage-400)] transition-colors duration-300">
                  Узнать обо мне
                </Button>
              </div>

              {/* Trust Line */}
              <div className="pt-4 border-t border-[var(--color-stone-200)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[var(--color-stone-600)]">Конфиденциально и безопасно</span>
                  </div>
                  <span className="hidden sm:inline text-[var(--color-stone-300)]">·</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[var(--color-stone-600)]">Персональный подход</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - IMAGE WITH PREMIUM CARD */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                {/* Accent Shadow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-sage-300)] to-[var(--color-cream-200)] rounded-3xl opacity-30 blur-2xl" aria-hidden="true" />
                
                {/* Premium Card Container */}
                <div className="relative">
                  {/* Main Image Card */}
                  <div className="relative w-full aspect-[3/4] md:aspect-[5/7] rounded-3xl overflow-hidden bg-[var(--color-cream-200)] shadow-lg border border-[var(--color-stone-100)] border-opacity-50">
                    {specialist.photo ? (
                      <img src={specialist.photo} alt={specialist.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-stone-400)]">
                        <svg className="w-16 h-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-sm opacity-50">Фото специалиста</p>
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-stone-900)] via-transparent to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300" aria-hidden="true" />
                  </div>
                </div>

                {/* Floating Badge - Trust Indicator */}
                <div className="absolute -bottom-5 -left-3 md:-bottom-6 md:-left-4 bg-white rounded-2xl px-4 md:px-5 py-3 md:py-4 shadow-[var(--shadow-card)] border border-[var(--color-stone-100)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-sage-100)] to-[var(--color-cream-100)] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-5 h-5 text-[var(--color-sage-600)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-9 9a9 9 0 1118 0 9 9 0 01-18 0zm13.7-4.3a1 1 0 00-1.4-1.4L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--color-stone-700)] text-sm">Конфиденциально</div>
                      <div className="text-xs text-[var(--color-stone-400)] mt-0.5">Данные защищены</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* НАПРАВЛЕНИЯ */}
      {visibleServices.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader label="Направления" title="С чем я работаю"
              subtitle="Психологическая работа помогает в самых разных ситуациях." className="mb-14" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleServices.map(service => (
                <div key={service.id} className="card-soft p-7">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-100)] text-[var(--color-sage-600)] flex items-center justify-center mb-5">
                    {ICON_MAP[service.icon] || ICON_MAP.star}
                  </div>
                  <h3 className="font-semibold text-[var(--color-stone-800)] text-lg mb-2">{service.title}</h3>
                  <p className="text-[var(--color-stone-500)] text-sm leading-relaxed">{service.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ОБО МНЕ */}
      <section className="py-20 px-4 bg-[var(--color-cream-100)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="w-full aspect-[4/5] max-w-sm mx-auto lg:mx-0 rounded-3xl bg-[var(--color-cream-200)] overflow-hidden">
                {specialist.photo ? (
                  <img src={specialist.photo} alt={specialist.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--color-stone-300)]">
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className="badge badge-sage mb-4 inline-block">Обо мне</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-stone-800)] mb-6 leading-tight">
                {specialist.shortName || specialist.name}
              </h2>
              <p className="text-[var(--color-sage-600)] italic font-serif text-lg mb-5">{specialist.tagline}</p>
              <div className="space-y-4 text-[var(--color-stone-500)] leading-relaxed">
                {about.mainText && <p>{about.mainText}</p>}
                {about.approach && <p>{about.approach}</p>}
              </div>
              <div className="mt-8">
                <Button href="/about" variant="secondary">Подробнее обо мне</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ЦЕНЫ */}
      {visiblePricing.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionHeader label="Стоимость" title="Прозрачные цены"
              subtitle="Без скрытых платежей. Стоимость согласовывается до начала работы." className="mb-14" />
            <div className={`grid grid-cols-1 gap-6 ${visiblePricing.length > 1 ? 'md:grid-cols-' + Math.min(visiblePricing.length, 3) : ''}`}>
              {visiblePricing.map(plan => (
                <div key={plan.id}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    plan.isPopular
                      ? 'bg-[var(--color-sage-700)] text-white shadow-xl'
                      : 'bg-[var(--color-cream-100)] border border-[var(--color-stone-200)]'
                  }`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-[var(--color-accent)] text-white text-xs font-semibold px-4 py-1.5 rounded-full">Популярный выбор</span>
                    </div>
                  )}
                  <h3 className={`font-semibold text-lg mb-2 ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>{plan.title}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`font-serif text-4xl ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>{plan.price}</span>
                    {plan.price && !isNaN(Number(plan.price.replace(/\s/g, ''))) && (
                      <span className={`text-sm ${plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'}`}>₽</span>
                    )}
                  </div>
                  <p className={`text-sm mb-5 ${plan.isPopular ? 'text-[var(--color-sage-100)]' : 'text-[var(--color-stone-500)]'}`}>{plan.duration}</p>
                  {plan.features.length > 0 && (
                    <ul className="space-y-2 mb-8 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${plan.isPopular ? 'text-[var(--color-sage-100)]' : 'text-[var(--color-stone-600)]'}`}>
                          <svg className={`w-4 h-4 flex-shrink-0 ${plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-sage-500)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button href="/contact" variant={plan.isPopular ? 'primary' : 'secondary'} fullWidth
                    className={plan.isPopular ? '!bg-white !text-[var(--color-sage-800)]' : ''}>
                    Записаться
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {visibleFaq.length > 0 && (
        <section className="py-20 px-4 bg-[var(--color-cream-100)]">
          <div className="max-w-4xl mx-auto">
            <FAQAccordion items={visibleFaq} title="Часто задают вопросы" subtitle="Если не нашли ответа — просто напишите мне." label="FAQ" />
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection />

      {/* КОНТАКТЫ */}
      <section className="py-20 px-4 bg-[var(--color-cream-100)]" id="contact">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm title="Запишитесь на консультацию" subtitle="Заполните форму, и я свяжусь с вами в течение нескольких часов." />
            <div className="lg:pt-4">
              <h2 className="font-serif text-3xl text-[var(--color-stone-800)] mb-8">Как со мной связаться</h2>
              <div className="space-y-5">
                {contacts.phone && (
                  <a href={`tel:${contacts.phone}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-white border border-[var(--color-stone-200)] rounded-xl flex items-center justify-center text-[var(--color-sage-600)] flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-stone-400)]">Телефон</div>
                      <div className="font-medium text-[var(--color-stone-700)] group-hover:text-[var(--color-sage-700)] transition-colors">{contacts.phone}</div>
                    </div>
                  </a>
                )}
                {contacts.telegram && (
                  <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-white border border-[var(--color-stone-200)] rounded-xl flex items-center justify-center text-[var(--color-sage-600)] flex-shrink-0">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-stone-400)]">Telegram</div>
                      <div className="font-medium text-[var(--color-stone-700)] group-hover:text-[var(--color-sage-700)] transition-colors">Написать в Telegram</div>
                    </div>
                  </a>
                )}
                {locationDisplay && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-white border border-[var(--color-stone-200)] rounded-xl flex items-center justify-center text-[var(--color-sage-600)] flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-stone-400)]">Адрес</div>
                      <div className="font-medium text-[var(--color-stone-700)]">{locationDisplay}</div>
                    </div>
                  </div>
                )}
                {contacts.workingHours && (
                  <div className="mt-6 p-5 bg-white rounded-2xl border border-[var(--color-stone-100)]">
                    <div className="text-xs text-[var(--color-stone-400)] uppercase tracking-wider mb-2 font-medium">Режим работы</div>
                    <div className="text-sm text-[var(--color-stone-600)]">{contacts.workingHours}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
