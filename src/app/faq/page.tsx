import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Частые вопросы',
    description:
      'Ответы на частые вопросы о работе с психологом: как записаться, как проходит первая встреча, что с конфиденциальностью и чего ожидать от консультаций.',
    path: '/faq',
  })
}

export default function FAQPage() {
  const faqItems = getContent().faq.filter((item) => item.visible)

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-cream-100)] px-4 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-sage-500)] opacity-[0.04] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Частые вопросы' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)]"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-sage-600)]">
                FAQ
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-sage-200)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--color-sage-700)] shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-500)]" />
              <span>Собрала ответы на самые частые вопросы</span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[var(--color-stone-800)] md:text-6xl lg:text-7xl">
              Частые вопросы
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-stone-500)] md:text-xl">
              Здесь собраны ответы на вопросы, которые обычно возникают перед первой
              консультацией. Если вашего вопроса нет в списке, можно написать мне напрямую.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl">
          {faqItems.length > 0 ? (
            <FAQAccordion items={faqItems} showHeader={false} />
          ) : (
            <div className="rounded-3xl bg-[var(--color-cream-100)] p-10 text-center">
              <h2 className="mb-4 font-serif text-3xl text-[var(--color-stone-800)]">
                Раздел наполняется
              </h2>
              <p className="leading-relaxed text-[var(--color-stone-500)]">
                Вопросы и ответы скоро появятся здесь. Пока можно написать мне напрямую, и я
                подскажу всё, что важно именно для вашей ситуации.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        variant="cream"
        title="Не нашли ответа?"
        subtitle="Напишите мне напрямую, и я помогу разобраться с любым вопросом о формате работы, записи и первой встрече."
        primaryBtn={{ label: 'Связаться', href: '/contact' }}
        showContacts
      />
    </>
  )
}
