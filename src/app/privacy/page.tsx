import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { generatePageMetadata } from '@/lib/metadata'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = generatePageMetadata({
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности сайта психолога Анны Соколовой.',
  path: '/privacy',
})

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear()

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]}
          className="mb-8"
        />

        <h1 className="font-serif text-4xl text-[var(--color-stone-800)] mb-3">
          Политика конфиденциальности
        </h1>
        <p className="text-sm text-[var(--color-stone-400)] mb-10">
          Последнее обновление: {currentYear} год
        </p>

        <div className="prose-content space-y-8 text-[var(--color-stone-600)]">
          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              1. Общие положения
            </h2>
            <p className="leading-relaxed">
              Настоящая политика конфиденциальности описывает, как {SITE_CONFIG.name} (далее —
              «Я» или «Специалист») собирает, использует и защищает персональные данные
              пользователей сайта {SITE_CONFIG.url}.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              2. Какие данные я собираю
            </h2>
            <p className="leading-relaxed mb-3">
              При использовании формы обратной связи на сайте вы можете предоставить:
            </p>
            <ul className="space-y-2 pl-4">
              {['Имя', 'Номер телефона', 'Адрес электронной почты', 'Текст сообщения'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[var(--color-sage-400)] rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="leading-relaxed mt-3">
              Сайт также может автоматически собирать технические данные: тип браузера, IP-адрес,
              время посещения. Эти данные используются только в агрегированном виде для анализа
              посещаемости.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              3. Как я использую ваши данные
            </h2>
            <p className="leading-relaxed">
              Ваши данные используются исключительно для:
            </p>
            <ul className="space-y-2 pl-4 mt-3">
              {[
                'Ответа на ваш запрос и организации консультации',
                'Связи с вами по вопросам записи и переноса встреч',
                'Улучшения работы сайта (в агрегированном виде)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-[var(--color-sage-400)] rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              4. Передача данных третьим лицам
            </h2>
            <p className="leading-relaxed">
              Я не продаю, не передаю и не раскрываю ваши персональные данные третьим лицам.
              Исключение составляют случаи, прямо предусмотренные законодательством Российской
              Федерации.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              5. Конфиденциальность консультаций
            </h2>
            <p className="leading-relaxed">
              Всё, что вы рассказываете на психологических сессиях, является строго
              конфиденциальным. Я не раскрываю эту информацию ни при каких обстоятельствах, кроме
              случаев явной угрозы жизни (в соответствии с профессиональным Кодексом этики
              психолога).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              6. Ваши права
            </h2>
            <p className="leading-relaxed">
              Вы имеете право запросить информацию о хранящихся данных, потребовать их удаления
              или исправления. Для этого напишите мне на{' '}
              <a href={`mailto:${SITE_CONFIG.email}`} className="prose-link">
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              7. Cookies
            </h2>
            <p className="leading-relaxed">
              Сайт может использовать cookies для корректной работы и анализа посещаемости.
              Вы можете отключить cookies в настройках браузера, однако это может повлиять на
              функциональность сайта.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--color-stone-800)] mb-4">
              8. Контакты
            </h2>
            <p className="leading-relaxed">
              По вопросам, связанным с обработкой персональных данных, вы можете обратиться:
            </p>
            <div className="mt-3 p-5 bg-[var(--color-cream-100)] rounded-xl text-sm space-y-1">
              <p>{SITE_CONFIG.name}</p>
              <p>
                Email:{' '}
                <a href={`mailto:${SITE_CONFIG.email}`} className="prose-link">
                  {SITE_CONFIG.email}
                </a>
              </p>
              <p>Телефон: {SITE_CONFIG.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
