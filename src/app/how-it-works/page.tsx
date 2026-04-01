import type { Metadata } from 'next'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getConsultationFormatLabel, getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Методы работы',
    description:
      'Понятно и спокойно о том, как строится работа с психологом, какие методы используются и что происходит на консультациях.',
    path: '/how-it-works',
  })
}

export default function HowItWorksPage() {
  const content = getContent()
  const { contacts, location, pricing } = content

  const consultationFormat = getConsultationFormatLabel(location.consultationFormat)
  const sessionDuration = pricing.find((plan) => plan.visible)?.duration || '50-60 минут'
  const workingHours = contacts.workingHours || 'Время подбирается индивидуально'
  const locationLabel =
    location.showAddress && location.address ? `${location.city}, ${location.address}` : location.city

  const methodCards = [
    {
      title: 'Интегративный подход',
      description:
        'Работа выстраивается не по жёсткому шаблону, а под ваш запрос, состояние и темп. Это помогает сохранить и точность, и человеческое отношение.',
    },
    {
      title: 'КПТ-техники',
      description:
        'Используются там, где важно заметить связь между мыслями, эмоциями, телом и повседневными реакциями, которые поддерживают тревогу или истощение.',
    },
    {
      title: 'Гештальт-подход',
      description:
        'Помогает работать с чувствами, границами, контактом и повторяющимися сценариями в отношениях без упрощения и давления.',
    },
  ]

  const sessionBlocks = [
    {
      title: 'Что происходит на первой встрече',
      items: [
        'Вы рассказываете о себе и о том, что сейчас особенно беспокоит.',
        'Я задаю уточняющие вопросы, чтобы лучше понять ситуацию и контекст.',
        'Мы вместе смотрим, как может быть сформулирован запрос на работу.',
        'Вы оцениваете, подходит ли вам такой стиль взаимодействия.',
      ],
    },
    {
      title: 'Чего от вас не требуется',
      items: [
        'Приходить с идеально сформулированной проблемой.',
        'Заранее знать, сколько встреч понадобится.',
        'Сразу рассказывать всё личное, если пока нет готовности.',
        'Подстраиваться под «правильный» формат разговора.',
      ],
    },
  ]

  const workflow = [
    {
      step: '01',
      title: 'Фокус и запрос',
      description:
        'Сначала мы понимаем, что именно сейчас нуждается в внимании: тревога, выгорание, отношения, внутренний конфликт или жизненный переход.',
    },
    {
      step: '02',
      title: 'Понимание механики',
      description:
        'Дальше исследуем, как устроен ваш опыт: что запускает напряжение, как вы реагируете и что поддерживает текущий сценарий.',
    },
    {
      step: '03',
      title: 'Новые опоры',
      description:
        'Постепенно появляются более устойчивые способы выдерживать сложные эмоции, обозначать границы и опираться на себя.',
    },
    {
      step: '04',
      title: 'Закрепление изменений',
      description:
        'Когда становится больше ясности и устойчивости, мы смотрим, как эти изменения удерживаются в жизни вне кабинета или видеозвонка.',
    },
  ]

  const principles = [
    {
      title: 'Без давления',
      description:
        'Решение о продолжении работы всегда остаётся за вами. Первая встреча не обязывает продолжать терапию.',
    },
    {
      title: 'Конфиденциальность',
      description:
        'Всё, что обсуждается на консультациях, остаётся между нами. Это базовый профессиональный стандарт.',
    },
    {
      title: 'Понятный формат',
      description:
        'Длительность, формат и организационные детали обсуждаются заранее, без скрытых условий и двусмысленности.',
    },
  ]

  return (
    <>
      <section className="page-hero px-4 py-14 md:py-20">
        <div className="section-shell relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Методы работы' }]}
            className="mb-8"
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-end">
            <div className="max-w-3xl space-y-6">
              <span className="eyebrow">
                <span>Методы работы</span>
              </span>
              <span className="meta-pill">{consultationFormat}</span>

              <h1 className="text-[3rem] leading-[0.96] text-[var(--color-stone-800)] md:text-[4.1rem]">
                Понятно о том, как именно строится работа и что происходит на консультациях
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-[var(--color-stone-500)] md:text-xl">
                Этот раздел создан для взрослой аудитории, которой важно заранее понимать
                механику процесса: на чём основан подход, как проходит путь клиента и чего ждать
                от первых встреч.
              </p>
            </div>

            <div className="panel-strong p-6 md:p-7">
              <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-stone-400)]">
                Базовые ориентиры
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Формат', value: consultationFormat },
                  { label: 'Длительность', value: sessionDuration },
                  { label: 'График', value: workingHours },
                ].map((item) => (
                  <div key={item.label} className="rounded-[22px] bg-[var(--color-cream-50)] px-5 py-4">
                    <div className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-stone-400)]">
                      {item.label}
                    </div>
                    <div className="mt-2 font-serif text-[1.9rem] text-[var(--color-stone-800)]">
                      {item.value}
                    </div>
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

      <section className="section-space px-4">
        <div className="section-shell">
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow">
              <span>Подход</span>
            </span>
            <h2 className="mt-4 text-[2.8rem] leading-[1.02] text-[var(--color-stone-800)] md:text-[3.6rem]">
              На чём основана работа
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-stone-500)] md:text-lg">
              Подход описан обычным человеческим языком, без туманности и чрезмерной академичности.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {methodCards.map((card) => (
              <article key={card.title} className="card-soft p-7 md:p-8">
                <h3 className="text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-bg-warm section-space px-4">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            {sessionBlocks.map((block) => (
              <div key={block.title} className="panel-strong px-6 py-8 md:px-8 md:py-10">
                <h2 className="text-[2.2rem] leading-[1.04] text-[var(--color-stone-800)]">
                  {block.title}
                </h2>
                <ul className="mt-6 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                      <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-sage-500)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space px-4">
        <div className="section-shell">
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow">
              <span>Путь клиента</span>
            </span>
            <h2 className="mt-4 text-[2.8rem] leading-[1.02] text-[var(--color-stone-800)] md:text-[3.6rem]">
              Как развивается работа от встречи к встрече
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-stone-500)] md:text-lg">
              Это не жёсткая схема, а понятная логика движения, которая помогает взрослому клиенту видеть процесс яснее.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <article key={item.step} className="card-soft p-7">
                <div className="font-serif text-[2rem] text-[var(--color-sage-700)]">{item.step}</div>
                <h3 className="mt-4 text-[1.8rem] leading-[1.06] text-[var(--color-stone-800)]">
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

      <section className="section-bg-warm section-space px-4">
        <div className="section-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title} className="panel-muted px-6 py-8">
                <h2 className="text-[2rem] leading-[1.04] text-[var(--color-stone-800)]">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-stone-500)] md:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Если важно сначала понять процесс, а потом записываться"
        subtitle="Можно задать вопросы о методах, формате и первой встрече до начала работы."
      />
    </>
  )
}
