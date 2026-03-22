'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface FormData {
  name: string
  phone: string
  email: string
  message: string
  format: 'online' | 'offline' | ''
}

interface ContactFormProps {
  title?: string
  subtitle?: string
  className?: string
  city?: string
  availableFormats?: Array<'online' | 'offline'>
}

export function ContactForm({
  title = 'Запись на консультацию',
  subtitle = 'Заполните форму, и я свяжусь с вами в течение нескольких часов, чтобы согласовать удобное время.',
  className = '',
  city = 'вашем городе',
  availableFormats = ['online', 'offline'],
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    format: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validate = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя'
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.phone = 'Укажите телефон или email'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <div className={`py-12 text-center ${className}`}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-sage-100)]">
          <svg
            className="h-8 w-8 text-[var(--color-sage-600)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-3 font-serif text-2xl text-[var(--color-stone-800)]">
          Заявка отправлена
        </h3>
        <p className="text-[var(--color-stone-500)]">
          Я свяжусь с вами в ближайшее время. Если вопрос срочный, можно написать мне напрямую
          через контакты на этой странице.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="mb-3 font-serif text-3xl text-[var(--color-stone-800)]">{title}</h2>
          )}
          {subtitle && (
            <p className="leading-relaxed text-[var(--color-stone-500)]">{subtitle}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]"
          >
            Ваше имя <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Как вас зовут"
            className={`input-field ${errors.name ? '!border-red-400 !ring-red-100' : ''}`}
            autoComplete="given-name"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-phone"
              className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]"
            >
              Телефон
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (___) ___-__-__"
              className={`input-field ${errors.phone ? '!border-red-400' : ''}`}
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.ru"
              className="input-field"
              autoComplete="email"
            />
          </div>
        </div>

        {availableFormats.length > 0 && (
          <div>
            <label
              htmlFor="contact-format"
              className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]"
            >
              Формат встречи
            </label>
            <select
              id="contact-format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="input-field appearance-none cursor-pointer bg-white"
            >
              <option value="">Выберите формат, если это важно</option>
              {availableFormats.includes('online') && (
                <option value="online">Онлайн</option>
              )}
              {availableFormats.includes('offline') && (
                <option value="offline">Очно{city ? `, ${city}` : ''}</option>
              )}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-sm font-medium text-[var(--color-stone-700)]"
          >
            Коротко о запросе
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Опишите в двух словах, с чем хотите поработать, или просто напишите, что хотите записаться..."
            className="input-field resize-none"
          />
        </div>

        <p className="text-xs leading-relaxed text-[var(--color-stone-400)]">
          Нажимая «Отправить», вы соглашаетесь с{' '}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-[var(--color-sage-600)]"
          >
            политикой конфиденциальности
          </a>
          . Ваши данные не передаются третьим лицам.
        </p>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Отправляю...' : 'Отправить заявку'}
        </Button>
      </form>
    </div>
  )
}
