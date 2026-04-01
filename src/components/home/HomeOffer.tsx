import { ContactForm } from '@/components/sections/ContactForm'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { PricingItem, SiteContent } from '@/lib/content'

interface HomeOfferProps {
  contacts: SiteContent['contacts']
  location: SiteContent['location']
  formatLabel: string
  locationDisplay: string
  pricing: PricingItem[]
  sessionDuration: string
}

function isNumericPrice(price: string) {
  return Number.isFinite(Number(price.replace(/[^\d]/g, '')))
}

export function HomeOffer({
  contacts,
  location,
  formatLabel,
  locationDisplay,
  pricing,
  sessionDuration,
}: HomeOfferProps) {
  const conditions = [
    {
      title: 'Длительность',
      value: sessionDuration,
      description: 'Стандартная продолжительность одной сессии.',
    },
    {
      title: 'Форматы',
      value: formatLabel,
      description: locationDisplay || 'Локация уточняется',
    },
    {
      title: 'Запись',
      value: contacts.workingHours || 'По согласованию',
      description: 'Время подбирается заранее в удобном окне.',
    },
  ]

  const availableFormats: Array<'online' | 'offline'> =
    location.consultationFormat === 'both'
      ? ['online', 'offline']
      : ([location.consultationFormat] as Array<'online' | 'offline'>)

  return (
    <>
      <section className="section-space px-4">
        <div className="section-shell">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              label="Услуги и условия"
              title="Форматы работы и прозрачные условия"
              subtitle="Основная информация о консультациях собрана здесь сразу: длительность, формат, стоимость и логика записи."
              align="left"
              className="mb-0"
            />
            <Button href="/pricing" variant="secondary">
              Открыть полный раздел
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className={`grid gap-5 ${pricing.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {pricing.length > 0 ? (
                pricing.map((plan) => (
                  <article
                    key={plan.id}
                    className={`p-7 md:p-8 ${plan.isPopular ? 'panel-dark text-white' : 'panel-strong'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`text-[0.72rem] uppercase tracking-[0.18em] ${plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'}`}>
                          {plan.format || 'Индивидуальная работа'}
                        </div>
                        <h2 className={`mt-4 text-[2rem] leading-[1.04] ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>
                          {plan.title}
                        </h2>
                      </div>
                      {plan.isPopular ? (
                        <span className="badge !bg-white/12 !text-[var(--color-sage-100)]">Оптимальный выбор</span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className={`font-serif text-[2.5rem] ${plan.isPopular ? 'text-white' : 'text-[var(--color-stone-800)]'}`}>
                        {plan.price}
                      </span>
                      {isNumericPrice(plan.price) ? (
                        <span className={plan.isPopular ? 'text-[var(--color-sage-200)]' : 'text-[var(--color-stone-400)]'}>₽</span>
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
                ))
              ) : (
                <article className="panel-strong p-7 md:p-8">
                  <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                    Услуги и условия
                  </div>
                  <h2 className="mt-4 text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
                    Стоимость сейчас уточняется
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                    Раздел с ценами уже подготовлен по структуре, но фактические тарифы ещё не
                    заполнены. Их можно уточнить до первой записи.
                  </p>
                  <div className="mt-8">
                    <Button href="/contact">Уточнить стоимость</Button>
                  </div>
                </article>
              )}
            </div>

            <aside className="space-y-4">
              {conditions.map((item) => (
                <div key={item.title} className="card-soft p-6">
                  <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                    {item.title}
                  </div>
                  <div className="mt-3 font-serif text-[2rem] text-[var(--color-stone-800)]">
                    {item.value}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)]">
                    {item.description}
                  </p>
                </div>
              ))}

              <div className="panel-muted px-6 py-6">
                <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                  Важные детали
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-stone-500)]">
                  <p>Очный и онлайн-формат можно выбрать в зависимости от запроса и обстоятельств.</p>
                  <p>Точный адрес офлайн-встреч сообщается после подтверждения записи, если это важно для приватности.</p>
                  <p>Если остались вопросы по стоимости или формату, их можно уточнить до первой консультации.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-bg-warm section-space px-4" id="contact">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="panel-strong px-6 py-8 md:px-8 md:py-10">
              <ContactForm
                title="Запись на консультацию"
                subtitle="Заполните форму, если хотите обсудить первую встречу, формат работы или удобное время."
                city={location.city}
                availableFormats={availableFormats}
              />
            </div>

            <div className="space-y-4">
              <div className="panel-muted px-6 py-8 md:px-8">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-stone-400)]">
                  Контакты
                </div>
                <h2 className="mt-4 text-[2.35rem] leading-[1.02] text-[var(--color-stone-800)]">
                  Можно связаться и напрямую
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--color-stone-500)]">
                  {contacts.phone ? (
                    <a href={`tel:${contacts.phone}`} className="block rounded-[20px] border border-white/70 bg-white/80 px-5 py-4 transition-colors hover:border-[rgba(149,169,149,0.55)]">
                      <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">Телефон</span>
                      <span className="mt-2 block text-base font-medium text-[var(--color-stone-700)]">{contacts.phone}</span>
                    </a>
                  ) : null}
                  {contacts.telegram ? (
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-[20px] border border-white/70 bg-white/80 px-5 py-4 transition-colors hover:border-[rgba(149,169,149,0.55)]"
                    >
                      <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">Telegram</span>
                      <span className="mt-2 block text-base font-medium text-[var(--color-stone-700)]">Написать в Telegram</span>
                    </a>
                  ) : null}
                  <div className="rounded-[20px] border border-white/70 bg-white/80 px-5 py-4">
                    <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">Формат работы</span>
                    <span className="mt-2 block text-base font-medium text-[var(--color-stone-700)]">{formatLabel}</span>
                    <p className="mt-2 text-sm text-[var(--color-stone-500)]">{locationDisplay || 'Локация уточняется'}</p>
                  </div>
                </div>
              </div>

              <div className="panel-dark px-6 py-8 text-white md:px-8">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                  Важно знать
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-stone-300)]">
                  <p>Решение о продолжении работы принимается спокойно после первой встречи.</p>
                  <p>Всё обсуждаемое на консультациях остаётся конфиденциальным.</p>
                  <p>Если вам удобнее сначала задать вопрос о формате или стоимости, это нормально.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
