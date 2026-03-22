import Link from 'next/link'
import { getContent } from '@/lib/content'
import { SectionHeader } from '@/components/ui/SectionHeader'

const iconMap: Record<string, React.ReactNode> = {
  wave: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0 0 2-4 4-4s4 4 4 4 2-4 4-4 4 4 4 4" />
    </svg>
  ),
  flame: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  heart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  star: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  bolt: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  compass: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  ),
}

export function ServiceCards() {
  const services = (() => {
    try {
      return getContent().services.filter(service => service.visible)
    } catch {
      return []
    }
  })()

  return (
    <section className="py-20 px-4 bg-white" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Направления"
          title="С чем я работаю"
          subtitle="Психологическая работа помогает в самых разных ситуациях — от конкретных трудностей до глубокого желания лучше понять себя."
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="card-soft p-7 group block"
            >
              {/* Иконка */}
              <div className="w-12 h-12 rounded-xl bg-[var(--color-sage-100)] text-[var(--color-sage-600)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-sage-200)] transition-colors duration-300">
                {iconMap[service.icon]}
              </div>

              {/* Контент */}
              <h3 className="font-semibold text-[var(--color-stone-800)] text-lg mb-2 group-hover:text-[var(--color-sage-700)] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-[var(--color-stone-500)] text-sm leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Стрелка */}
              <div className="mt-5 flex items-center text-xs text-[var(--color-sage-500)] font-medium gap-1 group-hover:gap-2 transition-all duration-300">
                Подробнее
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Заметка */}
        <p className="text-center text-sm text-[var(--color-stone-400)] mt-10">
          Не видите свою ситуацию? Напишите мне — вероятно, я смогу помочь.
        </p>
      </div>
    </section>
  )
}
