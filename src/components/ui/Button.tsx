import Link from 'next/link'
import { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  external?: boolean
  fullWidth?: boolean
}

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[var(--color-sage-700)] hover:bg-white/70 hover:text-[var(--color-sage-900)] font-medium text-sm transition-colors duration-300 cursor-pointer',
}

const sizes = {
  sm: 'min-h-[2.8rem] px-5 py-2.5 text-sm',
  md: '',
  lg: 'min-h-[3.6rem] px-8 py-4 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  external = false,
  fullWidth = false,
}: ButtonProps) {
  const baseClass = `${variants[variant]} ${size !== 'md' ? sizes[size] : ''} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`

  if (href) {
    if (external) {
      return (
        <a href={href} className={baseClass} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClass} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={baseClass} disabled={disabled}>
      {children}
    </button>
  )
}
