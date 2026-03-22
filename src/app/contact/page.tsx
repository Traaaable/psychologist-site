import type { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getConsultationFormatLabel, getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Контакты и запись на консультацию',
    description:
      'Свяжитесь со мной удобным способом и запишитесь на консультацию. На странице указаны актуальные контакты, формат работы и информация о приёме.',
    path: '/contact',
    pageKey: 'contact',
  })
}

function getTelegramLabel(link: string) {
  if (!link) {
    return ''
  }

  return link.replace(/^https?:\/\/t\.me\//, '@')
}

function getVkLabel(link: string) {
  if (!link) {
    return ''
  }

  return link.replace(/^https?:\/\/vk\.com\//, 'vk.com/')
}

function getWhatsAppLabel(link: string) {
  if (!link) {
    return ''
  }

  return link.replace(/^https?:\/\/wa\.me\//, '+')
}

export default function ContactPage() {
  const content = getContent()
  const { contacts, location } = content

  const consultationFormat = getConsultationFormatLabel(location.consultationFormat)
  const locationLabel =
    location.showAddress && location.address ? `${location.city}, ${location.address}` : location.city
  const availableFormats: Array<'online' | 'offline'> =
    location.consultationFormat === 'both'
      ? ['online', 'offline']
      : ([location.consultationFormat] as Array<'online' | 'offline'>)

  const contactMethods = [
    {
      key: 'phone',
      label: 'Телефон',
      value: contacts.phone,
      href: contacts.phone ? `tel:${contacts.phone}` : '',
      desc: contacts.workingHours || 'Связь по телефону',
      external: false,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
    },
    {
      key: 'telegram',
      label: 'Telegram',
      value: getTelegramLabel(contacts.telegram),
      href: contacts.telegram,
      desc: 'Быстрый ответ в мессенджере',
      external: true,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: getWhatsAppLabel(contacts.whatsapp),
      href: contacts.whatsapp,
      desc: 'Сообщения в рабочее время',
      external: true,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      value: contacts.email,
      href: contacts.email ? `mailto:${contacts.email}` : '',
      desc: 'Для подробных сообщений',
      external: false,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
    },
    {
      key: 'vk',
      label: 'ВКонтакте',
      value: getVkLabel(contacts.vk),
      href: contacts.vk,
      desc: 'Профиль или сообщество',
      external: true,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.785 15.756s.288-.032.435-.19c.135-.144.131-.415.131-.415s-.019-1.266.57-1.453c.58-.184 1.324 1.224 2.115 1.765.599.41 1.055.32 1.055.32l2.119-.03s1.108-.069.582-.941c-.043-.072-.305-.642-1.57-1.815-1.324-1.228-1.146-1.03.448-3.155.971-1.295 1.36-2.086 1.239-2.425-.116-.323-.83-.237-.83-.237l-2.385.015s-.177-.024-.308.053c-.128.076-.21.252-.21.252s-.378 1.004-.883 1.858c-1.065 1.8-1.491 1.894-1.665 1.782-.407-.263-.305-1.056-.305-1.619 0-1.758.267-2.49-.52-2.68-.261-.063-.453-.106-1.121-.113-.858-.01-1.584.003-1.994.203-.273.133-.483.43-.355.446.158.022.516.096.705.354.245.333.236 1.08.236 1.08s.141 2.071-.329 2.329c-.323.178-.768-.185-1.722-1.814-.488-.833-.856-1.757-.856-1.757s-.07-.167-.196-.257c-.154-.109-.369-.145-.369-.145l-2.267.015s-.34.01-.464.16c-.111.135-.009.412-.009.412s1.775 4.154 3.786 6.244c1.844 1.915 3.937 1.789 3.937 1.789z" />
        </svg>
      ),
    },
  ].filter((item) => item.value && item.href)

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-cream-100)] px-4 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-sage-500)] opacity-[0.04] blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]}
            className="mb-8"
          />
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="h-1 w-8 rounded-full bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-sage-300)]"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-sage-600)]">
                Связаться и записаться
              </span>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-sage-200)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--color-sage-700)] shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-500)]" />
              <span>{consultationFormat}</span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-[var(--color-stone-800)] md:text-6xl lg:text-7xl">
              Контакты и запись
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--color-stone-500)] md:text-xl">
              Можно заполнить форму или написать напрямую удобным способом. Здесь всегда
              отображаются актуальные контакты и формат приёма из админки.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm
                title="Напишите мне"
                subtitle="Коротко расскажите о запросе или просто оставьте контакты для связи."
                city={location.city}
                availableFormats={availableFormats}
              />
            </div>

            <div className="lg:col-span-2">
              <h2 className="mb-8 font-serif text-3xl text-[var(--color-stone-800)]">
                Другие способы связи
              </h2>

              {contactMethods.length > 0 ? (
                <div className="space-y-5">
                  {contactMethods.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-4 rounded-2xl border border-[var(--color-stone-100)] bg-[var(--color-cream-50)] p-4 transition-all duration-200 hover:border-[var(--color-sage-200)] hover:bg-[var(--color-sage-100)]"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--color-stone-200)] bg-white text-[var(--color-sage-600)] transition-colors duration-200 group-hover:border-[var(--color-sage-200)] group-hover:bg-[var(--color-sage-100)]">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-0.5 text-xs text-[var(--color-stone-400)]">{item.label}</div>
                        <div className="truncate text-sm font-medium text-[var(--color-stone-700)]">
                          {item.value}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right text-xs text-[var(--color-stone-400)]">
                        {item.desc}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[var(--color-cream-100)] p-6 text-sm leading-relaxed text-[var(--color-stone-500)]">
                  Контакты пока не заполнены. Их можно добавить через админку в разделе контактов.
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-[var(--color-cream-100)] p-6">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-stone-700)]">
                  Формат приёма
                </h3>
                <p className="text-sm text-[var(--color-stone-500)]">{consultationFormat}</p>
                {location.formatNote && (
                  <p className="mt-2 text-xs text-[var(--color-stone-400)]">{location.formatNote}</p>
                )}
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--color-cream-100)] p-6">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-stone-700)]">
                  Локация
                </h3>
                <p className="text-sm text-[var(--color-stone-500)]">{locationLabel || 'Уточняется'}</p>
                {!location.showAddress && location.address && (
                  <p className="mt-2 text-xs text-[var(--color-stone-400)]">
                    Точный адрес сообщается после записи.
                  </p>
                )}
              </div>

              {contacts.workingHours && (
                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-stone-400)]">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-sage-400)]" />
                  {contacts.workingHours}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
