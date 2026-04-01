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
  const containerWidth = align === 'center' ? 'max-w-3xl' : 'max-w-2xl'

  const titleSizeClass = {
    lg: 'text-3xl md:text-[2.7rem]',
    xl: 'text-[2.55rem] md:text-[3.4rem]',
    '2xl': 'text-[2.9rem] md:text-[4.2rem]',
  }[titleSize]

  return (
    <div className={`${className}`}>
      <div className={`${alignClass} ${containerWidth} space-y-4`}>
        {label && (
          <div className={`${align === 'center' ? 'justify-center' : ''} eyebrow`}>
            <span>{label}</span>
          </div>
        )}

        <h2
          className={`font-serif ${titleSizeClass} text-[var(--color-stone-800)] leading-[1.02] tracking-tight`}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="text-base leading-8 text-[var(--color-stone-500)] md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
