import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { CTASection } from '@/components/sections/CTASection'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'
import { FAQ_ITEMS } from '@/lib/constants'

export const metadata: Metadata = generatePageMetadata({
  title: 'Частые вопросы',
  description:
    'Ответы на частые вопросы о работе с психологом: как записаться, что будет на первой сессии, сколько стоит, конфиденциально ли это и многое другое.',
  path: '/faq',
})

// Дополнительные вопросы только для страницы FAQ
const additionalFAQ = [
  {
    id: 8,
    question: 'Как понять, что терапия помогает?',
    answer:
      'Результаты работы не всегда заметны сразу — иногда это постепенные, но устойчивые изменения: меньше тревоги, больше ясности в принятии решений, изменения в отношениях. Мы регулярно обсуждаем с вами, как идёт работа, что меняется, а что нет.',
  },
  {
    id: 9,
    question: 'Нужно ли мне идти в терапию, если я справляюсь сам?',
    answer:
      'Не обязательно. Психолог — не скорая помощь только для кризисов. Многие приходят не потому что "всё плохо", а потому что хотят лучше понять себя, развиваться или разобраться с конкретными темами. Решение за вами.',
  },
  {
    id: 10,
    question: 'Вы работаете с детьми или подростками?',
    answer:
      'На данный момент я работаю только со взрослыми (от 18 лет). Для работы с подростками или детьми я могу порекомендовать коллег.',
  },
  {
    id: 11,
    question: 'Что, если мне стало хуже после сессии?',
    answer:
      'Это бывает — особенно в начале работы или когда мы касаемся сложных тем. Если чувствуете, что состояние ухудшилось — сообщите мне на следующей сессии или напишите между встречами. Мы обсудим это и при необходимости скорректируем подход.',
  },
]

export default function FAQPage() {
  const allFAQItems = [...FAQ_ITEMS, ...additionalFAQ]

  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Частые вопросы' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            {/* Accent Line */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Часто задаемые вопросы</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
              <span>FAQ</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
              Частые вопросы
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
              Собрала ответы на вопросы, которые задают чаще всего. Если не нашли своего — просто напишите мне.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ АККОРДЕОН */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion
            items={allFAQItems}
            showHeader={false}
          />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        variant="cream"
        title="Не нашли ответа?"
        subtitle="Напишите мне напрямую — отвечу на любой вопрос."
        primaryBtn={{ label: 'Написать', href: '/contact' }}
        showContacts
      />
    </>
  )
}
