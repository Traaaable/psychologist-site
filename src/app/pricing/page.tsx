import type { Metadata } from 'next'
import { PriceCards } from '@/components/sections/PriceCards'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Стоимость консультаций',
    description:
      'Стоимость и форматы психологических консультаций. Прозрачные условия и понятная структура работы.',
    path: '/pricing',
    pageKey: 'pricing',
  })
}

export default function PricingPage() {
  const pricing = getContent().pricing.filter(plan => plan.visible)

  return (
    <>
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Стоимость' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Прозрачное ценообразование</span>
            </div>

            <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
              <span>{pricing.length > 0 ? `${pricing.length} варианта консультации` : 'Стоимость уточняется'}</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
              Прозрачные цены
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
              Все актуальные варианты консультаций и стоимость собраны ниже. Если удобнее,
              можно сначала написать мне и уточнить формат.
            </p>
          </div>
        </div>
      </section>

      {pricing.length > 0 ? (
        <PriceCards items={pricing} />
      ) : (
        <section className="py-20 px-4 bg-[var(--color-cream-100)]">
          <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl p-10 border border-[var(--color-stone-200)] shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-3xl text-[var(--color-stone-800)] mb-4">
              Стоимость уточняется
            </h2>
            <p className="text-[var(--color-stone-500)] leading-relaxed">
              Раздел с ценами ещё наполняется. Напишите мне, и я расскажу о доступных форматах
              и стоимости консультации.
            </p>
          </div>
        </section>
      )}

      <CTASection
        variant="cream"
        title="Остались вопросы?"
        subtitle="Напишите мне — отвечу на вопросы о стоимости, формате и первой встрече."
        showContacts
      />
    </>
  )
}
