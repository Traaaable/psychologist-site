import type { Metadata } from 'next'
import { PriceCards } from '@/components/sections/PriceCards'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getConsultationFormatLabel, getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Услуги и условия',
    description:
      'Понятно о стоимости, форматах консультаций, длительности встреч и организационных условиях работы.',
    path: '/pricing',
    pageKey: 'pricing',
  })
}

export default function PricingPage() {
  const content = getContent()
  const { pricing, location, contacts } = content
  const visiblePricing = pricing.filter((plan) => plan.visible)
  const formatLabel = getConsultationFormatLabel(location.consultationFormat)
  const locationLabel =
    location.showAddress && location.address ? `${location.city}, ${location.address}` : location.city
  const sessionDuration = visiblePricing[0]?.duration || '50-60 минут'

  const summaryCards = [
    {
      label: 'Формат',
      value: formatLabel,
      description: location.formatNote || 'Можно выбрать удобный формат консультации.',
    },
    {
      label: 'Длительность',
      value: sessionDuration,
      description: 'Стандартная продолжительность одной встречи.',
    },
    {
      label: 'Запись',
      value: contacts.workingHours || 'По согласованию',
      description: 'Время подбирается заранее в удобном окне.',
    },
  ]

  const processNotes = [
    {
      title: 'До первой встречи',
      description:
        'Можно задать вопросы о формате, стоимости и доступном времени ещё до записи на консультацию.',
    },
    {
      title: 'Онлайн и офлайн',
      description:
        'Если доступны оба формата, их можно выбирать исходя из запроса, графика и уровня комфорта.',
    },
    {
      title: 'Организационные детали',
      description:
        'Точный адрес очных встреч и другие детали сообщаются после подтверждения записи, если это важно для приватности.',
    },
    {
      title: 'Перенос и отмена',
      description:
        'Условия переноса лучше уточнить заранее до старта работы, чтобы ожидания с обеих сторон были прозрачными.',
    },
  ]

  return (
    <>
      <section className="page-hero px-4 py-14 md:py-20">
        <div className="section-shell relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Услуги и условия' }]}
            className="mb-8"
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
            <div className="max-w-3xl space-y-6">
              <span className="eyebrow">
                <span>Услуги и условия</span>
              </span>
              <span className="meta-pill">{formatLabel}</span>

              <h1 className="text-[3rem] leading-[0.96] text-[var(--color-stone-800)] md:text-[4.1rem]">
                Прозрачный раздел о стоимости, формате и организационных условиях работы
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-[var(--color-stone-500)] md:text-xl">
                Этот раздел собран так, чтобы важная информация считывалась сразу: без тяжёлых
                таблиц, скрытых условий и лишней неопределённости.
              </p>
            </div>

            <div className="panel-strong p-6 md:p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-stone-400)]">
                Что видно сразу
              </div>
              <div className="mt-5 space-y-4">
                {summaryCards.map((item) => (
                  <div key={item.label} className="rounded-[22px] bg-[var(--color-cream-50)] px-5 py-4">
                    <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                      {item.label}
                    </div>
                    <div className="mt-2 font-serif text-[1.9rem] text-[var(--color-stone-800)]">
                      {item.value}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-stone-500)]">
                      {item.description}
                    </p>
                  </div>
                ))}
                {locationLabel ? (
                  <p className="text-sm leading-7 text-[var(--color-stone-500)]">
                    Локация: <span className="text-[var(--color-stone-700)]">{locationLabel}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PriceCards
        items={visiblePricing}
        title="Актуальные форматы консультаций"
        subtitle="Если фактическая стоимость ещё не указана в контенте, это всё равно видно честно: структура раздела остаётся ясной, а тариф можно уточнить до записи."
      />

      <section className="section-bg-warm section-space px-4">
        <div className="section-shell">
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow">
              <span>Организация работы</span>
            </span>
            <h2 className="mt-4 text-[2.8rem] leading-[1.02] text-[var(--color-stone-800)] md:text-[3.6rem]">
              Что ещё важно знать до начала работы
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-stone-500)] md:text-lg">
              Этот блок снимает основные организационные вопросы и делает вход в терапию спокойнее
              для обеих сторон.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processNotes.map((item) => (
              <article key={item.title} className="card-soft p-7">
                <h3 className="text-[1.8rem] leading-[1.06] text-[var(--color-stone-800)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="cream"
        title="Если хотите сначала уточнить детали"
        subtitle="Можно задать вопрос о стоимости, формате или первой встрече до записи на консультацию."
      />
    </>
  )
}
