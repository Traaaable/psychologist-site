import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { SiteContent } from '@/lib/content'

const ICON_MAP: Record<string, ReactNode> = {
  wave: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 0 2-4 4-4s4 4 4 4 2-4 4-4 4 4 4 4" /></svg>,
  flame: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  heart: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  star: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  bolt: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  compass: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>,
}

interface HomeOverviewProps {
  about: SiteContent['about']
  services: SiteContent['services']
  trustCards: Array<{ label: string; value: string; description: string }>
}

export function HomeOverview({ about, services, trustCards }: HomeOverviewProps) {
  const audienceCards = [
    {
      title: 'Если важно разобраться без давления',
      description:
        'Подходит тем, кому нужен деликатный профессиональный разговор, а не поток советов и универсальных рецептов.',
    },
    {
      title: 'Если нужен понятный процесс',
      description:
        'Заранее ясно, как проходит первая встреча, что происходит на сессиях и как обычно выстраивается регулярная работа.',
    },
    {
      title: 'Если вы выбираете специалиста внимательно',
      description:
        'Сайт помогает спокойно оценить подход, темы работы, методы и условия ещё до первой записи.',
    },
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Первичный контакт',
      description:
        'Вы оставляете заявку или пишете напрямую. Согласуем формат и удобное время первой встречи.',
    },
    {
      step: '02',
      title: 'Первая консультация',
      description:
        'Разбираем, с чем вы пришли, что сейчас особенно важно и какой рабочий фокус можно обозначить на старте.',
    },
    {
      step: '03',
      title: 'Понимание механики запроса',
      description:
        'Смотрим, как устроены ваши реакции, напряжение, повторяющиеся сценарии и внутренние опоры.',
    },
    {
      step: '04',
      title: 'Системная работа',
      description:
        'На регулярных встречах укрепляем ясность, устойчивость и новые способы справляться с тем, что истощает.',
    },
  ]

  const methodsPreview = [
    {
      title: 'Интегративный подход',
      description:
        'Работа строится не по шаблону, а под ваш запрос, состояние и темп. Важна не только техника, но и то, как именно она вам подходит.',
    },
    {
      title: 'КПТ-техники',
      description:
        'Помогают заметить связи между мыслями, эмоциями, телесным напряжением и привычными реакциями.',
    },
    {
      title: 'Гештальт-подход',
      description:
        'Даёт возможность бережно работать с чувствами, контактом, границами и повторяющимися отношенческими сценариями.',
    },
  ]

  return (
    <>
      <section className="section-space px-4">
        <div className="section-shell">
          <SectionHeader
            label="Кому подходит"
            title="Спокойный формат для взрослых людей, которые выбирают терапию осознанно"
            subtitle="Здесь можно без спешки понять, подходит ли вам такой стиль работы: деликатный, структурный и без инфошума."
            align="left"
            className="mb-10"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {audienceCards.map((card) => (
              <div key={card.title} className="card-soft p-7 md:p-8">
                <h2 className="text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {services.length > 0 ? (
        <section className="section-bg-warm section-space px-4">
          <div className="section-shell">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader
                label="Запросы"
                title="С чем можно обратиться"
                subtitle="Формулировки намеренно сделаны понятными. Важно не только название проблемы, но и то, как она проявляется именно в вашей жизни."
                align="left"
                className="mb-0"
              />
              <Link href="/services" className="btn-secondary self-start">
                Все запросы
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className="card-soft p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-sage-100)] text-[var(--color-sage-700)]">
                    {ICON_MAP[service.icon] || ICON_MAP.star}
                  </div>
                  <h2 className="mt-5 text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                    {service.shortDesc}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)]">
                    {service.fullDesc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-space px-4">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="panel-strong px-6 py-8 md:px-8 md:py-10">
              <SectionHeader
                label="Как строится работа"
                title="Путь клиента устроен понятно и без туманности"
                subtitle="У взрослой аудитории часто есть важный запрос на ясность. Поэтому логика работы обозначается заранее."
                align="left"
                titleSize="lg"
                className="mb-8"
              />

              <div className="space-y-4">
                {processSteps.map((item) => (
                  <div
                    key={item.step}
                    className="grid gap-4 rounded-[24px] border border-[rgba(221,212,200,0.9)] bg-[var(--color-cream-50)] p-5 md:grid-cols-[74px_minmax(0,1fr)]"
                  >
                    <div className="font-serif text-[2rem] text-[var(--color-sage-700)]">{item.step}</div>
                    <div>
                      <h2 className="text-[1.8rem] leading-[1.06] text-[var(--color-stone-800)]">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="panel-muted px-6 py-8 md:px-8 md:py-10">
                <SectionHeader
                  label="Методы"
                  title="Что лежит в основе подхода"
                  subtitle="Методы нужны не ради академичности, а чтобы работа была точной, бережной и связанной с вашим реальным запросом."
                  align="left"
                  titleSize="lg"
                  className="mb-8"
                />

                <div className="space-y-4">
                  {methodsPreview.map((method) => (
                    <div
                      key={method.title}
                      className="rounded-[24px] border border-[rgba(221,212,200,0.82)] bg-white/78 p-5"
                    >
                      <h2 className="text-[1.8rem] leading-[1.06] text-[var(--color-stone-800)]">
                        {method.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                        {method.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button href="/how-it-works" variant="secondary">
                    Подробнее о методах работы
                  </Button>
                </div>
              </div>

              <div className="panel-dark px-6 py-8 text-white md:px-8">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                  Почему это вызывает доверие
                </div>
                <p className="mt-4 text-lg leading-8 text-[var(--color-stone-200)]">
                  Здесь нет обещаний «быстро всё исправить». Есть аккуратная профессиональная
                  работа, где можно лучше понять свою ситуацию и вернуть больше устойчивости.
                </p>
                <div className="mt-6 text-sm leading-7 text-[var(--color-stone-300)]">
                  {about.values}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-bg-warm section-space px-4">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="panel-muted px-6 py-8 md:px-8 md:py-10">
              <SectionHeader
                label="О специалисте"
                title="Почему с этим специалистом удобно выстраивать спокойную работу"
                subtitle="Важно не только образование, но и то, как человек удерживает пространство терапии: бережно, структурно и без давления."
                align="left"
                titleSize="lg"
                className="mb-8"
              />

              <div className="space-y-5 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                {about.mainText ? <p>{about.mainText}</p> : null}
                {about.approach ? <p>{about.approach}</p> : null}
              </div>

              {about.quote ? (
                <blockquote className="mt-8 rounded-[24px] border border-[rgba(221,212,200,0.9)] bg-white/80 p-6">
                  <div className="quote-block">«{about.quote}»</div>
                </blockquote>
              ) : null}

              <div className="mt-8">
                <Button href="/about" variant="secondary">
                  Подробнее о специалисте
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {trustCards.map((card) => (
                <div key={card.label} className="card-soft p-7">
                  <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                    {card.label}
                  </div>
                  <div className="mt-4 font-serif text-[2.2rem] text-[var(--color-stone-800)]">
                    {card.value}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-stone-500)]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
