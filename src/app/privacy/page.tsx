import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Политика конфиденциальности',
    description:
      'Как на сайте обрабатываются персональные данные, для чего они используются и как можно запросить их удаление или уточнение.',
    path: '/privacy',
  })
}

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear()
  const content = getContent()
  const specialistName =
    content.specialist.name || content.specialist.shortName || 'Специалист'
  const siteUrl = content.seo.siteUrl || 'http://localhost:3000'
  const email = content.contacts.email
  const phone = content.contacts.phone

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]}
          className="mb-8"
        />

        <h1 className="mb-3 font-serif text-4xl text-[var(--color-stone-800)]">
          Политика конфиденциальности
        </h1>
        <p className="mb-10 text-sm text-[var(--color-stone-400)]">
          Последнее обновление: {currentYear} год
        </p>

        <div className="prose-content space-y-8 text-[var(--color-stone-600)]">
          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              1. Общие положения
            </h2>
            <p className="leading-relaxed">
              Настоящая политика конфиденциальности описывает, как {specialistName} собирает,
              использует и защищает персональные данные посетителей сайта {siteUrl}.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              2. Какие данные могут собираться
            </h2>
            <p className="mb-3 leading-relaxed">
              При использовании формы обратной связи на сайте вы можете добровольно предоставить:
            </p>
            <ul className="space-y-2 pl-4">
              {['Имя', 'Номер телефона', 'Адрес электронной почты', 'Текст сообщения'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-sage-400)]" />
                    {item}
                  </li>
                )
              )}
            </ul>
            <p className="mt-3 leading-relaxed">
              Сайт также может автоматически собирать технические данные, например тип
              браузера, IP-адрес и время посещения. Эти сведения используются только в
              агрегированном виде для анализа работы сайта.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              3. Для чего используются данные
            </h2>
            <p className="leading-relaxed">Предоставленные данные используются только для:</p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                'ответа на ваш запрос и организации консультации',
                'связи по вопросам записи, переноса и уточнения деталей встречи',
                'улучшения работы сайта на основе обезличенной статистики',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-sage-400)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              4. Передача данных третьим лицам
            </h2>
            <p className="leading-relaxed">
              Персональные данные не продаются и не передаются третьим лицам, кроме случаев,
              прямо предусмотренных законодательством Российской Федерации.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              5. Конфиденциальность консультаций
            </h2>
            <p className="leading-relaxed">
              Всё, что обсуждается в рамках психологических консультаций, является
              конфиденциальным. Исключения возможны только в случаях, предусмотренных законом и
              профессиональной этикой, например при прямой угрозе жизни.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              6. Ваши права
            </h2>
            <p className="leading-relaxed">
              Вы можете запросить информацию о хранящихся персональных данных, уточнение,
              исправление или удаление сведений. Для этого используйте контакты, указанные на
              сайте.
              {email && (
                <>
                  {' '}
                  Основной адрес для связи:{' '}
                  <a href={`mailto:${email}`} className="prose-link">
                    {email}
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              7. Cookies
            </h2>
            <p className="leading-relaxed">
              Сайт может использовать cookies для корректной работы и анализа посещаемости. Вы
              можете отключить cookies в настройках браузера, однако это может повлиять на
              работу отдельных функций сайта.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl text-[var(--color-stone-800)]">
              8. Контакты
            </h2>
            <p className="leading-relaxed">
              По вопросам, связанным с обработкой персональных данных, можно обратиться по
              контактам ниже.
            </p>
            <div className="mt-3 space-y-1 rounded-xl bg-[var(--color-cream-100)] p-5 text-sm">
              <p>{specialistName}</p>
              {email && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${email}`} className="prose-link">
                    {email}
                  </a>
                </p>
              )}
              {phone && <p>Телефон: {phone}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
