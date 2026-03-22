import type { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = generatePageMetadata({
  title: 'Контакты — записаться на консультацию',
  description:
    'Запишитесь на консультацию к психологу Анне Соколовой. Работаю в Москве и онлайн. Ответ в течение нескольких часов.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-[var(--color-cream-100)] relative overflow-hidden py-16 md:py-24 px-4">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] bg-[var(--color-sage-500)] blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] bg-[var(--color-accent)] blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Записаться' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            {/* Accent Line */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)] rounded-full" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-sage-600)]">Начните свой путь</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white bg-opacity-50 backdrop-blur-md text-[var(--color-sage-700)] px-5 py-3 rounded-full text-sm font-medium border border-[var(--color-sage-200)] border-opacity-50 shadow-sm">
              <span className="w-2 h-2 bg-[var(--color-sage-500)] rounded-full animate-pulse" />
              <span>Запись на консультацию</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--color-stone-800)] leading-[1.05] tracking-tight">
              Записаться на консультацию
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--color-stone-500)] leading-relaxed font-light max-w-2xl">
              Заполните форму или напишите напрямую любым удобным способом. Я отвечаю в течение нескольких часов.
            </p>
          </div>
        </div>
      </section>

      {/* ОСНОВНОЙ БЛОК */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Форма */}
            <div className="lg:col-span-3">
              <ContactForm title="" subtitle="" />
            </div>

            {/* Контакты */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl text-[var(--color-stone-800)] mb-8">
                Другие способы связаться
              </h2>

              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    ),
                    label: 'Позвонить',
                    value: SITE_CONFIG.phone,
                    href: `tel:${SITE_CONFIG.phone}`,
                    desc: 'Пн–Пт: 10:00–20:00',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    ),
                    label: 'Telegram',
                    value: '@anna_sokolova_psy',
                    href: SITE_CONFIG.telegram,
                    desc: 'Быстрый ответ',
                    external: true,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                    label: 'WhatsApp',
                    value: '+7 (999) 123-45-67',
                    href: SITE_CONFIG.whatsapp,
                    desc: 'Ответ в рабочее время',
                    external: true,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                    label: 'Email',
                    value: SITE_CONFIG.email,
                    href: `mailto:${SITE_CONFIG.email}`,
                    desc: 'Для развёрнутых запросов',
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-stone-100)] bg-[var(--color-cream-50)] hover:bg-[var(--color-sage-100)] hover:border-[var(--color-sage-200)] transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-stone-200)] flex items-center justify-center text-[var(--color-sage-600)] flex-shrink-0 group-hover:bg-[var(--color-sage-100)] group-hover:border-[var(--color-sage-200)] transition-colors duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--color-stone-400)] mb-0.5">{item.label}</div>
                      <div className="font-medium text-[var(--color-stone-700)] truncate text-sm">
                        {item.value}
                      </div>
                    </div>
                    <div className="text-xs text-[var(--color-stone-400)] text-right flex-shrink-0">
                      {item.desc}
                    </div>
                  </a>
                ))}
              </div>

              {/* Адрес */}
              <div className="mt-8 p-6 bg-[var(--color-cream-100)] rounded-2xl">
                <h3 className="font-semibold text-[var(--color-stone-700)] mb-3 text-sm">
                  Адрес для очных встреч
                </h3>
                <p className="text-sm text-[var(--color-stone-500)]">{SITE_CONFIG.location}</p>
                <p className="text-xs text-[var(--color-stone-400)] mt-2">
                  Точный адрес кабинета сообщается при записи
                </p>
              </div>

              {/* Время ответа */}
              <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-stone-400)]">
                <div className="w-2 h-2 bg-[var(--color-sage-400)] rounded-full animate-pulse" />
                Обычно отвечаю в течение нескольких часов
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
