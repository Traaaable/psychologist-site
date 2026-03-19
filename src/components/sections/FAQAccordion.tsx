'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  title?: string
  subtitle?: string
  label?: string
  showHeader?: boolean
  className?: string
}

export function FAQAccordion({
  items,
  title = 'Частые вопросы',
  subtitle = 'Если не нашли ответа — напишите мне напрямую.',
  label = 'Вопросы',
  showHeader = true,
  className = '',
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  // Schema.org для FAQ (SEO)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {showHeader && (
        <SectionHeader label={label} title={title} subtitle={subtitle} className="mb-12" />
      )}

      <div className="max-w-2xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="faq-item">
            <button
              className="faq-button"
              onClick={() => toggle(item.id)}
              aria-expanded={openId === item.id}
              aria-controls={`faq-answer-${item.id}`}
              id={`faq-question-${item.id}`}
            >
              <span className="pr-4 text-left">{item.question}</span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openId === item.id
                    ? 'bg-[var(--color-sage-100)] rotate-45'
                    : 'bg-[var(--color-stone-100)]'
                }`}
                aria-hidden="true"
              >
                <svg
                  className={`w-3 h-3 transition-colors duration-300 ${
                    openId === item.id
                      ? 'text-[var(--color-sage-700)]'
                      : 'text-[var(--color-stone-500)]'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>

            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openId === item.id ? 'max-h-96 pb-5' : 'max-h-0'
              }`}
            >
              <p className="text-[var(--color-stone-500)] text-base leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
