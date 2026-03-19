import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'sage' | 'cream' | 'stone'
  className?: string
}

export function Badge({ children, variant = 'sage', className = '' }: BadgeProps) {
  const variantClass = `badge-${variant}`
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  )
}
