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
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  const titleSizeClass = {
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    '2xl': 'text-5xl md:text-6xl',
  }[titleSize]

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <span className="badge badge-sage mb-4 inline-block">{label}</span>
      )}
      <h2
        className={`font-serif ${titleSizeClass} text-[var(--color-stone-800)] leading-tight mb-4`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--color-stone-500)] text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
