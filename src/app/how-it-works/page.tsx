import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Как проходят консультации',
  description:
    'Как устроена работа с психологом: формат сессий, онлайн и офлайн, первая встреча, частота и продолжительность работы. Подробный ответ на все ваши вопросы.',
  path: '/how-it-works',
})

export default function HowItWorksPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-sage-100)] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Как проходят консультации' }]}
            className="mb-8"
          />
          <div className="max-w-3xl">
            <span className="badge badge-sage mb-5 inline-block">Консультации</span>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-stone-800)] leading-tight mb-6">
              Как проходят консультации
            </h1>
            <p className="text-xl text-[var(--color-stone-500)] leading-relaxed">
              Понятно и честно — о том, чего ожидать от первой встречи и от работы в целом.
            </p>
          </div>
        </div>
      </section>

      {/* ПЕРВАЯ ВСТРЕЧА */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-6">
            Первая консультация
          </h2>
          <p className="text-[var(--color-stone-500)] text-lg leading-relaxed mb-10">
            Первая встреча ни к чему не обязывает. Это знакомство — возможность рассказать о
            том, что беспокоит, и понять, подходит ли вам такой формат работы.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'Что происходит на первой встрече',
                items: [
                  'Вы рассказываете о себе и о том, что привело',
                  'Я задаю вопросы, чтобы лучше понять ситуацию',
                  'Мы обсуждаем ваш запрос и возможные цели',
                  'Вместе решаем, как может выглядеть дальнейшая работа',
                ],
              },
              {
                title: 'Что не нужно делать',
                items: [
                  'Готовиться и структурировать рассказ',
                  'Знать точно, чего вы хотите',
                  'Скрывать то, что кажется «несерьёзным»',
                  'Бояться сказать что-то «неправильное»',
                ],
              },
            ].map((block, i) => (
              <div key={i} className="bg-[var(--color-cream-100)] rounded-2xl p-7">
                <h3 className="font-semibold text-[var(--color-stone-800)] mb-4">{block.title}</h3>
                <ul className="space-y-2.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-[var(--color-stone-500)]">
                      <div className="w-1.5 h-1.5 bg-[var(--color-sage-400)] rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-sage-100)] rounded-2xl p-8">
            <p className="text-[var(--color-stone-600)] leading-relaxed">
              <span className="font-semibold text-[var(--color-stone-800)]">Важно: </span>
              После первой встречи вы принимаете решение о продолжении сами. Никакого давления
              и обязательств нет. Я уважаю ваше право выбирать, продолжать ли работу — и если
              нет, могу порекомендовать других специалистов.
            </p>
          </div>
        </div>
      </section>

      {/* ФОРМАТ РАБОТЫ */}
      <section className="py-20 px-4 bg-[var(--color-cream-100)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-12">
            Форматы работы
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Онлайн */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-stone-100)] shadow-[var(--shadow-soft)]">
              <div className="w-12 h-12 bg-[var(--color-sage-100)] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-sage-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-stone-800)] text-xl mb-4">Онлайн</h3>
              <p className="text-[var(--color-stone-500)] text-sm leading-relaxed mb-5">
                Сессии проходят в Zoom или другой удобной для вас платформе. Онлайн-формат
                подходит большинству клиентов и по качеству не уступает очным встречам.
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-stone-500)]">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Из любого места и города
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Экономия времени на дорогу
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Полная приватность и безопасность
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Стоимость такая же, как очно
                </li>
              </ul>
            </div>

            {/* Очно */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-stone-100)] shadow-[var(--shadow-soft)]">
              <div className="w-12 h-12 bg-[var(--color-sage-100)] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[var(--color-sage-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-stone-800)] text-xl mb-4">
                Очно, в Москве
              </h3>
              <p className="text-[var(--color-stone-500)] text-sm leading-relaxed mb-5">
                Принимаю в центре Москвы, в комфортном и тихом пространстве. Очные встречи
                предпочтительны для некоторых видов работы — особенно в начале терапии.
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-stone-500)]">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Уютный кабинет в центре Москвы
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Ул. Большая Никитская, 10
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Пн–Пт: 10:00–20:00
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-sage-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Суббота: 11:00–17:00
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* КАК УСТРОЕНА СЕССИЯ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-12">
            Как устроена работа
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: 'Продолжительность',
                value: '50–60 минут',
                desc: 'Стандартная продолжительность одной сессии',
              },
              {
                label: 'Частота',
                value: 'Раз в неделю',
                desc: 'Оптимальный ритм для устойчивых изменений',
              },
              {
                label: 'Продолжительность работы',
                value: 'От нескольких недель',
                desc: 'Зависит от запроса — обсуждаем на первой встрече',
              },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--color-cream-100)] rounded-2xl p-7 text-center">
                <div className="text-xs text-[var(--color-stone-400)] uppercase tracking-wider mb-2">
                  {item.label}
                </div>
                <div className="font-serif text-2xl text-[var(--color-stone-800)] mb-2">
                  {item.value}
                </div>
                <div className="text-xs text-[var(--color-stone-400)]">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Конфиденциальность */}
          <div className="bg-[var(--color-sage-100)] rounded-2xl p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[var(--color-sage-200)] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--color-sage-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-stone-800)] mb-2 text-lg">
                  Конфиденциальность
                </h3>
                <p className="text-[var(--color-stone-500)] leading-relaxed text-sm">
                  Всё, что вы рассказываете на сессиях, остаётся строго между нами. Это
                  профессиональный стандарт и этическое обязательство. Я не передаю информацию о
                  клиентах третьим лицам — ни родственникам, ни работодателям, ни кому-либо ещё.
                  Исключения возможны только в случаях, прямо предусмотренных законом (угроза жизни).
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
