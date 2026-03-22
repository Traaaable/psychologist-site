import { Button } from '@/components/ui/Button'
import { getContent } from '@/lib/content'

interface CTASectionProps {
  title?: string
  subtitle?: string
  primaryBtn?: { label: string; href: string }
  secondaryBtn?: { label: string; href: string }
  variant?: 'sage' | 'cream' | 'dark'
  showContacts?: boolean
}

export function CTASection({
  title = 'Готовы сделать первый шаг?',
  subtitle = 'Запишитесь на консультацию — первая встреча ни к чему не обязывает. Просто поговорим.',
  primaryBtn = { label: 'Записаться', href: '/contact' },
  secondaryBtn,
  variant = 'sage',
  showContacts = true,
}: CTASectionProps) {
  const bgClass = {
    sage: 'bg-[var(--color-sage-700)]',
    cream: 'bg-[var(--color-cream-100)]',
    dark: 'bg-[var(--color-stone-800)]',
  }[variant]

  const titleClass = {
    sage: 'text-white',
    cream: 'text-[var(--color-stone-800)]',
    dark: 'text-white',
  }[variant]

  const subtitleClass = {
    sage: 'text-[var(--color-sage-100)]',
    cream: 'text-[var(--color-stone-500)]',
    dark: 'text-[var(--color-stone-300)]',
  }[variant]

  const contactClass = {
    sage: 'text-[var(--color-sage-100)]',
    cream: 'text-[var(--color-stone-400)]',
    dark: 'text-[var(--color-stone-400)]',
  }[variant]

  let contacts = {
    telegram: '',
    whatsapp: '',
    phone: '',
  }

  try {
    const content = getContent()
    contacts = {
      telegram: content.contacts.telegram,
      whatsapp: content.contacts.whatsapp,
      phone: content.contacts.phone,
    }
  } catch { /* fallback */ }

  const hasContacts = contacts.telegram || contacts.whatsapp || contacts.phone

  return (
    <section className={`${bgClass} py-20 px-4`} aria-labelledby="cta-title">
      <div className="max-w-3xl mx-auto text-center">
        {/* Декоративный элемент */}
        <div className={`w-10 h-px mx-auto mb-6 ${variant === 'cream' ? 'bg-[var(--color-sage-300)]' : 'bg-white/30'}`} />

        <h2
          id="cta-title"
          className={`font-serif text-4xl md:text-5xl ${titleClass} mb-5 leading-tight`}
        >
          {title}
        </h2>
        <p className={`text-lg ${subtitleClass} mb-10 leading-relaxed`}>{subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {variant === 'sage' ? (
            <Button
              href={primaryBtn.href}
              className="!bg-white !text-[var(--color-sage-800)] hover:!bg-[var(--color-cream-100)]"
            >
              {primaryBtn.label}
            </Button>
          ) : (
            <Button href={primaryBtn.href}>{primaryBtn.label}</Button>
          )}

          {secondaryBtn && (
            <Button href={secondaryBtn.href} variant="secondary">
              {secondaryBtn.label}
            </Button>
          )}
        </div>

        {showContacts && hasContacts && (
          <p className={`mt-8 text-sm ${contactClass}`}>
            Или напишите напрямую:{' '}
            {contacts.telegram && (
              <>
                <a
                  href={contacts.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-3 hover:no-underline transition-all"
                >
                  Telegram
                </a>
                {(contacts.whatsapp || contacts.phone) && ' · '}
              </>
            )}
            {contacts.whatsapp && (
              <>
                <a
                  href={contacts.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-3 hover:no-underline transition-all"
                >
                  WhatsApp
                </a>
                {contacts.phone && ' · '}
              </>
            )}
            {contacts.phone && (
              <a
                href={`tel:${contacts.phone}`}
                className="underline underline-offset-3 hover:no-underline transition-all"
              >
                {contacts.phone}
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  )
}
