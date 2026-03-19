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
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-[var(--color-sage-700)] hover:text-[var(--color-sage-900)] hover:underline underline-offset-4 font-medium text-sm transition-colors duration-300 cursor-pointer',
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: '',
  lg: 'px-9 py-4 text-base',
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
        <a href={href} className={baseClass} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClass}>
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
