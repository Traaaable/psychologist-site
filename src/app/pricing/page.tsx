import type { Metadata } from 'next'
import { PriceCards } from '@/components/sections/PriceCards'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Стоимость консультаций',
  description:
    'Стоимость психологических консультаций у Анны Соколовой. Разовые сессии и пакеты. Онлайн и очно в Москве. Прозрачные цены без скрытых платежей.',
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Стоимость' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            {/* Accent Line */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Прозрачное ценообразование</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
              <span>Стоимость</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
              Прозрачные цены
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
              Никаких скрытых платежей. Стоимость одинакова для онлайн и очных встреч.
            </p>
          </div>
        </div>
      </section>

      {/* ПРАЙС-КАРТОЧКИ */}
      <PriceCards />

      {/* ВОПРОСЫ ОБ ОПЛАТЕ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-10">
            Об оплате
          </h2>
          <div className="space-y-5">
            {[
              {
                q: 'Как оплатить?',
                a: 'Переводом на карту (СБП, Сбербанк, Тинькофф) или наличными на очной встрече. Оплата производится до начала сессии.',
              },
              {
                q: 'Есть ли чек?',
                a: 'Я работаю как самозанятый специалист. Чек в приложении «Мой налог» предоставляется по запросу.',
              },
              {
                q: 'Что будет, если нужно отменить?',
                a: 'Сессию можно отменить или перенести не менее чем за 24 часа без дополнительной оплаты. При отмене менее чем за 24 часа сессия оплачивается полностью.',
              },
              {
                q: 'Возможен ли возврат за пакет?',
                a: 'Если вы купили пакет, но по объективным причинам не можете продолжить — неиспользованные сессии оплачиваются по разовой цене, остаток возвращается.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--color-cream-100)] rounded-2xl p-7">
                <h3 className="font-semibold text-[var(--color-stone-800)] mb-3">{item.q}</h3>
                <p className="text-[var(--color-stone-500)] text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="cream" title="Остались вопросы?" subtitle="Напишите мне — отвечу на любые вопросы об оплате и формате работы." showContacts />
    </>
  )
}
