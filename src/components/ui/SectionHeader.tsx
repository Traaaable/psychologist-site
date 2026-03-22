interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  titleSize?: 'lg' | 'xl' | '2xl'
  className?: string
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  titleSize = 'xl',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  const titleSizeClass = {
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    '2xl': 'text-5xl md:text-6xl',
  }[titleSize]

  return (
    <div className={`${className}`}>
      <div className={`${alignClass} space-y-5 ${align === 'center' ? 'max-w-3xl' : ''}`}>
        {/* Accent Line */}
        {label && (
          <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
            <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">{label}</span>
          </div>
        )}

        {/* Heading */}
        <h2
          className={`font-serif ${titleSizeClass} text-[var(--color-stone-800)] leading-[1.05] tracking-tight`}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
