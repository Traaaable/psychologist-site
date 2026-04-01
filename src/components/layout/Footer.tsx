import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants'

interface FooterProps {
  name?: string
  description?: string
  telegram?: string
  whatsapp?: string
  phone?: string
  email?: string
  location?: string
  workingHours?: string
}

export function Footer({
  name = 'Психолог',
  description = '',
  telegram = '',
  whatsapp = '',
  phone = '',
  email = '',
  location = '',
  workingHours = '',
}: FooterProps) {
  const links = [...NAV_LINKS, { href: '/faq', label: 'Вопросы' }]

  return (
    <footer className="px-4 pb-4 pt-12 md:px-6 md:pb-6 md:pt-16">
      <div className="section-shell">
        <div className="panel-dark overflow-hidden px-6 py-10 text-[var(--color-stone-300)] md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_0.85fr_0.95fr]">
            <div className="space-y-6">
              <div>
                <Link href="/" className="inline-block">
                  <span className="block font-serif text-3xl text-white">{name}</span>
                  <span className="mt-2 block text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-sage-200)]">
                    Частная психологическая практика
                  </span>
                </Link>
              </div>

              <p className="max-w-xl text-sm leading-7 text-[var(--color-stone-300)]">
                {description
                  ? description
                  : 'Спокойное и профессиональное пространство, где можно разобраться в своей ситуации без давления, спешки и лишнего шума.'}
              </p>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                  Что важно в работе
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-stone-300)]">
                  Конфиденциальность, ясные условия и уважение к вашему темпу. Решение о начале
                  или продолжении работы всегда остаётся за вами.
                </p>
              </div>
            </div>

            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                Навигация
              </div>
              <nav className="mt-5 grid gap-2" aria-label="Навигация в подвале">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-[16px] px-3 py-2 text-sm text-[var(--color-stone-300)] transition-colors hover:bg-white/6 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-5">
              <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                Контакты
              </div>

              <div className="space-y-3 text-sm leading-7 text-[var(--color-stone-300)]">
                {phone ? (
                  <a href={`tel:${phone}`} className="block transition-colors hover:text-white">
                    {phone}
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className="block transition-colors hover:text-white">
                    {email}
                  </a>
                ) : null}
                {telegram ? (
                  <a
                    href={telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors hover:text-white"
                  >
                    Telegram
                  </a>
                ) : null}
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-colors hover:text-white"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {location ? <div>{location}</div> : null}
                {workingHours ? (
                  <div className="text-[var(--color-stone-400)]">{workingHours}</div>
                ) : null}
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-sage-200)]">
                  Запись
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-stone-300)]">
                  Если удобнее начать с короткого контакта, используйте форму записи на сайте.
                </p>
                <Link href="/contact" className="btn-secondary mt-4 !border-white/15 !bg-white/8 !text-white hover:!bg-white/12">
                  Перейти к записи
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[var(--color-stone-400)] md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} {name}. Частная практика психолога.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/privacy" className="transition-colors hover:text-[var(--color-stone-200)]">
                Политика конфиденциальности
              </Link>
              <Link href="/contact" className="transition-colors hover:text-[var(--color-stone-200)]">
                Контакты и запись
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
