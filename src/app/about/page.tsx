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
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Обо мне' }]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Текст */}
            <div className="space-y-6">
              {/* Accent Line */}
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">О специалисте</span>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
                <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
                <span>Психолог</span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
                Анна Соколова
              </h1>

              {/* Tagline */}
              <p className="text-lg md:text-xl text-[var(--color-sage-600)] font-light italic font-serif">
                Психолог-консультант, гештальт-терапевт
              </p>

              {/* Description */}
              <p className="text-lg text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
                Помогаю взрослым людям справляться с трудностями, лучше понимать себя и находить
                опору в сложных жизненных ситуациях. Работаю с тревогой, выгоранием, кризисами,
                самооценкой и отношениями.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button href="/contact" size="lg" className="shadow-lg shadow-[var(--color-accent)]/10 hover:shadow-xl hover:shadow-[var(--color-accent)]/20 transition-all duration-300">
                  Записаться на консультацию
                </Button>
                <Button href="/how-it-works" variant="secondary" size="lg" className="border-2 border-[var(--color-stone-200)] hover:border-[var(--color-sage-400)] transition-colors duration-300">
                  Как проходят сессии
                </Button>
              </div>
            </div>

            {/* Фото */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Accent Shadow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-sage-300)] to-[var(--color-cream-200)] rounded-3xl opacity-30 blur-2xl" aria-hidden="true" />
              
              <div className="relative w-80 h-[460px] rounded-3xl bg-[var(--color-cream-200)] overflow-hidden shadow-lg border border-[var(--color-stone-100)] border-opacity-50">
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-stone-400)]">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} opacity="60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-5 -right-3 md:-bottom-6 md:-right-4 bg-white rounded-2xl px-4 md:px-5 py-3 md:py-4 shadow-[var(--shadow-card)] border border-[var(--color-stone-100)] backdrop-blur-sm">
                <div className="font-serif text-2xl md:text-3xl text-[var(--color-accent)] font-semibold">{SITE_CONFIG.experience}</div>
                <div className="text-xs text-[var(--color-stone-400)] mt-0.5">опыта работы</div>
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
