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
      <section className="bg-[var(--color-cream-100)] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Стоимость' }]}
            className="mb-8"
          />
          <div className="max-w-3xl">
            <span className="badge badge-sage mb-5 inline-block">Стоимость</span>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-stone-800)] leading-tight mb-6">
              Прозрачные цены
            </h1>
            <p className="text-xl text-[var(--color-stone-500)] leading-relaxed">
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
