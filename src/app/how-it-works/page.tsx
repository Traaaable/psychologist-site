import type { Metadata } from 'next'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getConsultationFormatLabel, getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Как проходят консультации',
    description:
      'Понятно и спокойно о том, как устроена первая встреча, в каком формате проходят консультации и как обычно строится работа с психологом.',
    path: '/how-it-works',
  })
}

export default function HowItWorksPage() {
  const content = getContent()
  const { contacts, location, pricing } = content

  const consultationFormat = getConsultationFormatLabel(location.consultationFormat)
  const locationLabel =
    location.showAddress && location.address ? `${location.city}, ${location.address}` : location.city
  const sessionDuration = pricing.find((plan) => plan.visible)?.duration || '50-60 минут'
  const workingHours = contacts.workingHours || 'Время подбираем индивидуально'
  const isOnlineAvailable = location.consultationFormat !== 'offline'
  const isOfflineAvailable = location.consultationFormat !== 'online'

  const firstSessionBlocks = [
    {
      title: 'Что происходит на первой встрече',
      items: [
        'Вы рассказываете о себе и о том, что сейчас беспокоит.',
        'Я задаю уточняющие вопросы, чтобы лучше понять ситуацию.',
        'Мы обсуждаем ваш запрос и то, каким может быть формат работы.',
        'Вместе смотрим, подходит ли вам такой способ взаимодействия.',
      ],
    },
    {
      title: 'Чего не нужно делать заранее',
      items: [
        'Готовить идеальный рассказ о себе.',
        'Точно знать формулировку проблемы.',
        'Скрывать то, что кажется неважным или неловким.',
        'Бояться сказать что-то не так.',
      ],
    },
  ]

  const workflowStats = [
    {
      label: 'Длительность',
      value: sessionDuration,
      desc: 'Стандартная продолжительность одной встречи.',
    },
    {
      label: 'Формат',
      value: consultationFormat,
      desc: location.formatNote || 'Формат выбираем под ваш запрос и обстоятельства.',
    },
    {
      label: 'График',
      value: workingHours,
      desc: 'Время встреч согласовываем заранее.',
    },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-sage-100)] px-4 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-sage-500)] opacity-[0.04] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Как проходят консультации' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)]"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-sage-600)]">
                Как это устроено
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-sage-200)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--color-sage-700)] shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-500)]" />
              <span>{consultationFormat}</span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[var(--color-stone-800)] md:text-6xl lg:text-7xl">
              Как проходят консультации
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-stone-500)] md:text-xl">
              Спокойно и без загадок о том, чего ждать от первой встречи, как обычно строится
              работа и какой формат можно выбрать.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif text-4xl text-[var(--color-stone-800)]">
            Первая консультация
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-[var(--color-stone-500)]">
            Первая встреча ни к чему не обязывает. Это знакомство, возможность рассказать о
            том, что вас беспокоит, и понять, подходит ли вам такой формат работы.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {firstSessionBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl bg-[var(--color-cream-100)] p-7">
                <h3 className="mb-4 font-semibold text-[var(--color-stone-800)]">
                  {block.title}
                </h3>
                <ul className="space-y-2.5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-[var(--color-stone-500)]"
                    >
                      <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-sage-400)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[var(--color-sage-100)] p-8">
            <p className="leading-relaxed text-[var(--color-stone-600)]">
              <span className="font-semibold text-[var(--color-stone-800)]">Важно: </span>
              после первой встречи решение о продолжении работы всегда остаётся за вами. Никакого
              давления или обязательств нет.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream-100)] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 font-serif text-4xl text-[var(--color-stone-800)]">
            Форматы работы
          </h2>

          <div
            className={`grid grid-cols-1 gap-6 ${isOnlineAvailable && isOfflineAvailable ? 'md:grid-cols-2' : ''}`}
          >
            {isOnlineAvailable && (
              <div className="rounded-2xl border border-[var(--color-stone-100)] bg-white p-8 shadow-[var(--shadow-soft)]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sage-100)]">
                  <svg className="h-6 w-6 text-[var(--color-sage-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-[var(--color-stone-800)]">Онлайн</h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--color-stone-500)]">
                  Консультации проходят по видеосвязи. Это удобный формат, если важна гибкость,
                  нет возможности приезжать лично или вы просто предпочитаете встречаться из
                  привычного пространства.
                </p>
                <ul className="space-y-2 text-sm text-[var(--color-stone-500)]">
                  {[
                    'Можно подключиться из любого города',
                    'Не нужно тратить время на дорогу',
                    'Качество работы сопоставимо с очными встречами',
                    workingHours,
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isOfflineAvailable && (
              <div className="rounded-2xl border border-[var(--color-stone-100)] bg-white p-8 shadow-[var(--shadow-soft)]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-sage-100)]">
                  <svg className="h-6 w-6 text-[var(--color-sage-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-[var(--color-stone-800)]">
                  Очно{location.city ? `, ${location.city}` : ''}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--color-stone-500)]">
                  Очные встречи проходят в спокойном пространстве, где можно быть без спешки и
                  отвлекающих факторов. Такой формат особенно важен тем, кому проще включаться в
                  контакт при личной встрече.
                </p>
                <ul className="space-y-2 text-sm text-[var(--color-stone-500)]">
                  {[locationLabel, location.formatNote || 'Очный формат обсуждается при записи', workingHours]
                    .filter(Boolean)
                    .map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 font-serif text-4xl text-[var(--color-stone-800)]">
            Как устроена работа
          </h2>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {workflowStats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[var(--color-cream-100)] p-7 text-center">
                <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-stone-400)]">
                  {item.label}
                </div>
                <div className="mb-2 font-serif text-2xl text-[var(--color-stone-800)]">
                  {item.value}
                </div>
                <div className="text-xs text-[var(--color-stone-400)]">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[var(--color-sage-100)] p-8">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-sage-200)]">
                <svg className="h-6 w-6 text-[var(--color-sage-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-stone-800)]">
                  Конфиденциальность
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-stone-500)]">
                  Всё, что обсуждается на сессиях, остаётся строго между нами. Это
                  профессиональный стандарт и важная часть безопасной психологической работы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
