import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = generatePageMetadata({
  title: 'Обо мне',
  description:
    'Анна Соколова — практикующий психолог с дипломом МГУ и 9-летним опытом. Работаю с тревогой, выгоранием и жизненными кризисами. Подробнее о подходе и образовании.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-cream-100)] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Обо мне' }]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Текст */}
            <div>
              <span className="badge badge-sage mb-5 inline-block">Психолог</span>
              <h1 className="font-serif text-5xl md:text-6xl text-[var(--color-stone-800)] leading-tight mb-6">
                Анна Соколова
              </h1>
              <p className="text-xl text-[var(--color-sage-600)] font-light mb-6 italic font-serif">
                Психолог-консультант, гештальт-терапевт
              </p>
              <p className="text-[var(--color-stone-500)] text-lg leading-relaxed mb-8">
                Помогаю взрослым людям справляться с трудностями, лучше понимать себя и находить
                опору в сложных жизненных ситуациях. Работаю с тревогой, выгоранием, кризисами,
                самооценкой и отношениями.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/contact">Записаться на консультацию</Button>
                <Button href="/how-it-works" variant="secondary">
                  Как проходят сессии
                </Button>
              </div>
            </div>

            {/* Фото */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-80 h-[460px] rounded-3xl bg-[var(--color-cream-200)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-stone-300)]">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl px-5 py-4 shadow-[var(--shadow-card)] border border-[var(--color-stone-100)]">
                <div className="text-2xl font-serif text-[var(--color-stone-800)]">{SITE_CONFIG.experience}</div>
                <div className="text-xs text-[var(--color-stone-400)]">опыта работы</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* О ПОДХОДЕ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-7 leading-tight">
                Мой подход к работе
              </h2>
              <div className="space-y-5 text-[var(--color-stone-500)] leading-relaxed">
                <p>
                  Я не верю в готовые рецепты счастья и не раздаю советов о том, как нужно жить.
                  Вместо этого я создаю пространство, в котором человек может спокойно посмотреть
                  на свою жизнь, разобраться в том, что происходит, и найти свои собственные ответы.
                </p>
                <p>
                  В работе я использую интегративный подход: сочетаю когнитивно-поведенческую
                  терапию, гештальт-подход и работу с телесными ощущениями. Это позволяет работать
                  не только с мыслями, но и с тем, что происходит глубже — с чувствами, паттернами
                  и тем, как человек воспринимает себя и мир.
                </p>
                <p>
                  Темп работы задаёте вы. Я не тороплю и не давлю. Иногда важно просто побыть
                  услышанным — и это тоже ценный результат.
                </p>
              </div>

              <blockquote className="quote-block mt-8">
                «Терапия — это не про то, чтобы стать другим человеком. Это про то, чтобы
                научиться жить с собой чуть легче.»
              </blockquote>
            </div>

            {/* Боковая статистика */}
            <div className="flex flex-col gap-4">
              {[
                { value: SITE_CONFIG.experience, label: 'практики' },
                { value: SITE_CONFIG.sessionsCount, label: 'консультаций' },
                { value: '3', label: 'направления подготовки' },
                { value: 'МГУ', label: 'базовое образование' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[var(--color-cream-100)] rounded-2xl p-5 text-center"
                >
                  <div className="font-serif text-3xl text-[var(--color-stone-800)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--color-stone-400)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ОБРАЗОВАНИЕ */}
      <section className="py-20 px-4 bg-[var(--color-cream-100)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-12">
            Образование и квалификация
          </h2>

          <div className="space-y-6">
            {[
              {
                year: '2015',
                title: 'МГУ им. М.В. Ломоносова',
                subtitle: 'Факультет психологии — специалист (диплом с отличием)',
                type: 'education',
              },
              {
                year: '2016–2019',
                title: 'Московский Гештальт Институт',
                subtitle: 'Полная программа подготовки гештальт-терапевтов — сертифицированный практик',
                type: 'education',
              },
              {
                year: '2018',
                title: 'Институт когнитивных исследований',
                subtitle: 'Когнитивно-поведенческая терапия — базовый курс',
                type: 'education',
              },
              {
                year: '2020',
                title: 'EMDR-терапия',
                subtitle: 'Международная сертификация по работе с травмой',
                type: 'education',
              },
              {
                year: 'постоянно',
                title: 'Личная терапия и супервизия',
                subtitle: 'Регулярно работаю в личной терапии и прохожу профессиональную супервизию',
                type: 'practice',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-6 bg-white rounded-2xl p-6 border border-[var(--color-stone-100)] shadow-[var(--shadow-soft)]"
              >
                <div className="flex-shrink-0 w-20 text-sm font-medium text-[var(--color-sage-600)] pt-0.5">
                  {item.year}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-stone-800)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-stone-500)]">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК Я РАБОТАЮ — ценности */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-[var(--color-stone-800)] mb-6">
            Что важно для меня в работе
          </h2>
          <p className="text-[var(--color-stone-500)] mb-12 leading-relaxed max-w-2xl">
            За годы практики я поняла, что работа строится не только на методах — важнее
            отношения и атмосфера, которую удаётся создать.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Безопасность прежде всего',
                desc: 'Сессия — это пространство, где нет правильных и неправильных ответов. Здесь можно говорить о том, о чём трудно говорить даже с близкими.',
              },
              {
                title: 'Уважение к вашему темпу',
                desc: 'Я не тороплю и не давлю. Глубокая работа требует времени — и это нормально.',
              },
              {
                title: 'Честность',
                desc: 'Я буду честна с вами: если вижу что-то важное — скажу. Если не знаю — признаю. Без позы всезнающего эксперта.',
              },
              {
                title: 'Практический результат',
                desc: 'Мне важно, чтобы то, что происходит на сессиях, имело значение в вашей реальной жизни — не только в кабинете.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--color-sage-100)] rounded-2xl p-7">
                <h3 className="font-semibold text-[var(--color-stone-800)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--color-stone-500)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Хотите познакомиться?"
        subtitle="Первая встреча — это просто разговор. Без обязательств и давления."
      />
    </>
  )
}
