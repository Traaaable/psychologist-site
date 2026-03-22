import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { PricingItem } from '@/lib/content'

interface PriceCardsProps {
  items: PricingItem[]
  title?: string
  subtitle?: string
}

export function PriceCards({
  items,
  title = 'Прозрачные цены',
  subtitle = 'Без скрытых платежей. Стоимость согласовывается до начала работы.',
}: PriceCardsProps) {
  return (
    <section className="py-20 px-4 bg-[var(--color-cream-100)]" aria-labelledby="pricing-heading">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Стоимость"
          title={title}
          subtitle={subtitle}
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.isPopular
                  ? 'bg-[var(--color-sage-700)] text-white shadow-xl'
                  : 'bg-white border border-[var(--color-stone-200)] shadow-[var(--shadow-soft)]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--color-accent)] text-white text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap">
                    Популярный выбор
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-semibold text-lg mb-1 ${
                    plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'
                  }`}
                >
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span
                    className={`font-serif text-4xl font-normal ${
                      plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'
                    }`}
                  >
                    ₽
                  </span>
                </div>
                {'pricePerSession' in plan && plan.pricePerSession && (
                  <p
                    className={`text-sm mt-1 ${
                      plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'
                    }`}
                  >
                    {plan.pricePerSession}
                  </p>
                )}
              </div>

              {/* Детали */}
              <div
                className={`flex flex-col gap-1 text-sm mb-6 ${
                  plan.isPopular ? 'text-[var(--color-sage-100)]' : 'text-[var(--color-stone-500)]'
                }`}
              >
                <span>{plan.duration}</span>
                {plan.format && <span>{plan.format}</span>}
                {plan.description && !plan.format && <span>{plan.description}</span>}
              </div>

              {/* Фичи */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-sage-500)]'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      className={
                        plan.isPopular ? 'text-[var(--color-sage-100)]' : 'text-[var(--color-stone-600)]'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.isPopular ? (
                <Button
                  href="/contact"
                  className="!bg-white !text-[var(--color-sage-800)] hover:!bg-[var(--color-cream-100)] w-full"
                  fullWidth
                >
                  Выбрать
                </Button>
              ) : (
                <Button href="/contact" variant="secondary" fullWidth>
                  Выбрать
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--color-stone-400)] mt-8">
          Оплата возможна переводом на карту или наличными. Чек предоставляется по запросу.
        </p>
      </div>
    </section>
  )
}
