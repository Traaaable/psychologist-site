'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  specialistName?: string
  phone?: string
  navLinks?: typeof NAV_LINKS
}

export function Header({
  specialistName = 'Психолог',
  phone = '',
  navLinks = NAV_LINKS,
}: HeaderProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const primaryLinks = navLinks.filter((link) => link.href !== '/contact')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 md:px-6 md:py-4">
      <div
        className={`section-shell transition-all duration-300 ${
          isScrolled || isMenuOpen ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        <div
          className={`relative rounded-[28px] border px-4 py-3 transition-all duration-300 md:px-5 md:py-4 ${
            isScrolled || isMenuOpen
              ? 'border-[rgba(221,212,200,0.92)] bg-[rgba(248,245,239,0.88)] shadow-[var(--shadow-card)] backdrop-blur-xl'
              : 'border-[rgba(255,255,255,0.6)] bg-[rgba(250,248,243,0.72)] shadow-[0_14px_40px_rgba(43,40,32,0.05)] backdrop-blur-lg'
          }`}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[220px_minmax(0,1fr)_auto]">
            <Link href="/" className="min-w-0 leading-tight">
              <span className="block truncate font-serif text-[1.45rem] text-[var(--color-stone-800)] md:text-[1.55rem]">
                {specialistName}
              </span>
              <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-stone-400)]">
                Частная психологическая практика
              </span>
            </Link>

            <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Основная навигация">
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[rgba(215,224,215,0.88)] text-[var(--color-sage-800)]'
                        : 'text-[var(--color-stone-600)] hover:bg-white/70 hover:text-[var(--color-sage-700)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="rounded-full border border-[rgba(221,212,200,0.95)] bg-white/70 px-4 py-2.5 text-sm text-[var(--color-stone-600)] transition-colors hover:text-[var(--color-sage-700)]"
                >
                  {phone}
                </a>
              ) : null}
              <Button href="/contact" size="sm">
                Записаться
              </Button>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(221,212,200,0.95)] bg-white/75 text-[var(--color-stone-700)] transition-colors hover:text-[var(--color-sage-700)] lg:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={isMenuOpen}
            >
              <div className="relative h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 lg:hidden ${
              isMenuOpen ? 'mt-4 max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-[24px] border border-[rgba(221,212,200,0.85)] bg-white/88 p-3 shadow-[var(--shadow-soft)]">
              <nav className="space-y-1" aria-label="Мобильная навигация">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between rounded-[18px] px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'bg-[rgba(215,224,215,0.78)] text-[var(--color-sage-800)]'
                          : 'text-[var(--color-stone-700)] hover:bg-[rgba(242,237,228,0.8)]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="text-[var(--color-stone-400)]">
                        →
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-4 rounded-[20px] bg-[var(--color-cream-50)] p-4">
                <div className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-stone-400)]">
                  Спокойная запись без спешки
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-stone-500)]">
                  Можно заполнить форму или связаться напрямую, если так удобнее.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button href="/contact" fullWidth onClick={() => setIsMenuOpen(false)}>
                    Записаться на консультацию
                  </Button>
                  {phone ? (
                    <a
                      href={`tel:${phone}`}
                      className="text-center text-sm text-[var(--color-stone-500)] underline decoration-[rgba(113,136,113,0.35)] underline-offset-4"
                    >
                      {phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
