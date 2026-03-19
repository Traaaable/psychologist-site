'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  specialistName?: string
  phone?: string
  navLinks?: typeof NAV_LINKS
}

export function Header({ specialistName = 'Психолог', phone = '', navLinks = NAV_LINKS }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(51,47,40,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex flex-col leading-tight group" onClick={() => setIsMenuOpen(false)}>
            <span className="font-serif text-xl text-[var(--color-stone-800)] group-hover:text-[var(--color-sage-700)] transition-colors duration-300">
              {specialistName}
            </span>
            <span className="text-xs text-[var(--color-stone-400)] font-normal tracking-wide">психолог</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Основная навигация">
            {navLinks.slice(0, -1).map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm text-[var(--color-stone-600)] hover:text-[var(--color-sage-700)] transition-colors duration-200 font-medium">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {phone && (
              <a href={`tel:${phone}`} className="text-sm text-[var(--color-stone-500)] hover:text-[var(--color-sage-700)] transition-colors duration-200">
                {phone}
              </a>
            )}
            <Button href="/contact" size="sm">Записаться</Button>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-[var(--color-stone-100)] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[var(--color-stone-700)] transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--color-stone-700)] transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--color-stone-700)] transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-16 bg-white/98 backdrop-blur-md transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col px-6 py-8 gap-1" aria-label="Мобильная навигация">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
              className="py-4 text-lg text-[var(--color-stone-700)] hover:text-[var(--color-sage-700)] border-b border-[var(--color-stone-100)] transition-colors duration-200 font-medium">
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/contact" fullWidth onClick={() => setIsMenuOpen(false)}>
              Записаться на консультацию
            </Button>
            {phone && (
              <a href={`tel:${phone}`} className="text-center text-[var(--color-stone-500)] py-2">{phone}</a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
