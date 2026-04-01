import { Button } from '@/components/ui/Button'
import type { SiteContent } from '@/lib/content'

interface HomeHeroProps {
  specialist: SiteContent['specialist']
  location: SiteContent['location']
  formatLabel: string
  locationDisplay: string
  mainRequests: string[]
}

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('') || 'ПС'
  )
}

export function HomeHero({
  specialist,
  location,
  formatLabel,
  locationDisplay,
  mainRequests,
}: HomeHeroProps) {
  const trustCards = [
    {
      title: specialist.experience || 'Опыт уточняется',
      text: 'Профессиональная практика со взрослыми клиентами.',
    },
    {
      title: specialist.sessionsCount || 'Консультации',
      text: 'Работа с тревогой, выгоранием, отношениями и кризисами.',
    },
    {
      title: formatLabel,
      text: location.formatNote || 'Очно и онлайн в зависимости от вашего запроса.',
    },
  ]

  return (
    <section className="hero-gradient px-4 pb-16 pt-8 md:pb-20 md:pt-12">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="panel-strong overflow-hidden p-4 md:p-5">
            <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(232,222,206,0.82),rgba(237,241,235,0.95))]">
              {specialist.photo ? (
                <img
                  src={specialist.photo}
                  alt={specialist.name}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              ) : (
                <div className="flex aspect-[4/5] flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/65 bg-white/55 font-serif text-3xl text-[var(--color-sage-700)] shadow-[var(--shadow-soft)]">
                    {getInitials(specialist.shortName || specialist.name)}
                  </div>
                  <p className="mt-6 max-w-xs text-sm leading-7 text-[var(--color-stone-500)]">
                    Здесь будет профессиональное фото специалиста. Блок уже подготовлен под
                    вертикальный портрет и остаётся слева в композиции.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 px-2 pb-2 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-stone-400)]">
                  Частная практика
                </div>
                <div className="mt-2 font-serif text-3xl text-[var(--color-stone-800)]">
                  {specialist.shortName || specialist.name}
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--color-stone-500)]">
                  {specialist.title || 'Психолог-консультант'}
                </p>
              </div>

              <div className="rounded-[22px] bg-[var(--color-cream-50)] px-4 py-3 text-sm text-[var(--color-stone-500)]">
                <div className="font-medium text-[var(--color-stone-700)]">{formatLabel}</div>
                <div className="mt-1">{locationDisplay || 'Локация уточняется'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-7 lg:pl-4">
            <div className="space-y-4">
              <span className="eyebrow">
                <span>Психолог для взрослых</span>
              </span>
              <span className="meta-pill">
                {location.city ? `${formatLabel} · ${location.city}` : formatLabel}
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-[3rem] leading-[0.96] text-[var(--color-stone-800)] md:text-[4.2rem] xl:text-[5rem]">
                {specialist.heroText || 'Психологическая работа, в которой есть ясность, деликатность и уважение к вашему темпу'}
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-[var(--color-stone-500)] md:text-xl">
                {specialist.heroSubtitle}
              </p>
            </div>

            {mainRequests.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {mainRequests.map((request) => (
                  <span
                    key={request}
                    className="rounded-full border border-[rgba(188,202,191,0.78)] bg-white/70 px-4 py-2 text-sm text-[var(--color-sage-700)]"
                  >
                    {request}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">
                Записаться на консультацию
              </Button>
              <Button href="/how-it-works" variant="secondary" size="lg">
                Посмотреть, как строится работа
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Конфиденциально и без давления',
                'Понятная структура первой встречи',
                'Прозрачные условия и форматы',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-[rgba(221,212,200,0.9)] bg-white/72 px-4 py-4 text-sm leading-6 text-[var(--color-stone-600)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustCards.map((card) => (
                <div key={card.title} className="panel-muted px-5 py-5">
                  <div className="font-serif text-[1.9rem] text-[var(--color-stone-800)]">
                    {card.title}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)]">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
