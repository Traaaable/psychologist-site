import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { PricingItem } from '@/lib/content'

interface PriceCardsProps {
  items: PricingItem[]
  title?: string
  subtitle?: string
}

function isNumericPrice(price: string) {
  return Number.isFinite(Number(price.replace(/[^\d]/g, '')))
}

export function PriceCards({
  items,
  title = 'Услуги и условия',
  subtitle = 'Ниже собраны актуальные форматы консультаций и стоимость. Все организационные моменты лучше обсудить заранее, чтобы вход в работу был спокойным и понятным.',
}: PriceCardsProps) {
  return (
    <section className="section-space px-4" aria-labelledby="pricing-heading">
      <div className="section-shell">
        <SectionHeader label="Стоимость" title={title} subtitle={subtitle} align="left" className="mb-10" />

        {items.length > 0 ? (
          <div className={`grid gap-5 ${items.length > 1 ? 'md:grid-cols-2 xl:grid-cols-3' : ''}`}>
            {items.map((plan) => (
              <article
                key={plan.id}
                className={`p-7 md:p-8 ${plan.isPopular ? 'panel-dark text-white' : 'panel-strong'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-[0.72rem] uppercase tracking-[0.18em] ${plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'}`}>
                      {plan.format || 'Индивидуальная работа'}
                    </div>
                    <h3 className={`mt-4 text-[2rem] leading-[1.04] ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>
                      {plan.title}
                    </h3>
                  </div>
                  {plan.isPopular ? (
                    <span className="badge !bg-white/12 !text-[var(--color-sage-100)]">
                      Часто выбирают
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className={`font-serif text-[2.5rem] ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>
                    {plan.price}
                  </span>
                  {isNumericPrice(plan.price) ? (
                    <span className={plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'}>
                      ₽
                    </span>
                  ) : null}
                </div>

                <div className={`mt-3 text-sm leading-7 ${plan.isPopular ? 'text-[var(--color-stone-200)]' : 'text-[var(--color-stone-500)]'}`}>
                  <div>{plan.duration}</div>
                  {plan.description ? <div>{plan.description}</div> : null}
                </div>

                {plan.features.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-7">
                        <svg
                          className={`mt-1 h-4 w-4 flex-shrink-0 ${plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-sage-600)]'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.isPopular ? 'text-[var(--color-stone-200)]' : 'text-[var(--color-stone-600)]'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-8">
                  <Button
                    href="/contact"
                    variant={plan.isPopular ? 'secondary' : 'primary'}
                    fullWidth
                    className={plan.isPopular ? '!border-white/12 !bg-white !text-[var(--color-sage-800)] hover:!bg-[var(--color-cream-100)]' : ''}
                  >
                    Записаться
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel-strong p-7 md:p-8">
            <h3 className="text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
              Стоимость сейчас уточняется
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
              Структура раздела уже подготовлена, но фактические тарифы пока не заполнены.
              Их можно уточнить до первой записи.
            </p>
            <div className="mt-8">
              <Button href="/contact">Уточнить стоимость</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
