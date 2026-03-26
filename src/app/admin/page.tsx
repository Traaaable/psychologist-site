import { isAuthenticated } from '@/lib/auth'
import { getPublishedBlogPosts } from '@/lib/blog'
import { redirect } from 'next/navigation'
import { getContent } from '@/lib/content'
import { AdminShell } from '@/components/admin/AdminShell'
import Link from 'next/link'
import { logInfo } from '@/lib/logger'

export default async function AdminDashboard() {
  const auth = await isAuthenticated()
  if (!auth) {
    logInfo('admin.dashboard.redirect_to_login', { target: '/manage/login' })
    redirect('/manage/login')
  }

  const content = getContent()
  const publishedPosts = getPublishedBlogPosts(content)
  logInfo('admin.dashboard.rendered', {
    specialistName: content.specialist.shortName || content.specialist.name || 'Психолог',
    lastUpdated: content._meta.lastUpdated,
  })

  const sections = [
    {
      href: '/admin/general',
      title: 'Основная информация',
      desc: 'ФИО, фото, город, контакты',
      status: content.specialist.name ? `${content.specialist.name}` : 'Не заполнено',
      icon: '👤',
      urgent: !content.specialist.name,
    },
    {
      href: '/admin/contacts',
      title: 'Контакты и место приёма',
      desc: 'Телефон, адрес, формат консультаций',
      status: content.contacts.phone || content.location.city ? `${content.location.city}${content.contacts.phone ? ` · ${content.contacts.phone}` : ''}` : 'Не заполнено',
      icon: '📍',
      urgent: !content.contacts.phone,
    },
    {
      href: '/admin/about',
      title: 'Обо мне',
      desc: 'Текст, образование, сертификаты',
      status: content.about.mainText ? 'Заполнено' : 'Не заполнено',
      icon: '📖',
      urgent: false,
    },
    {
      href: '/admin/services',
      title: 'Направления работы',
      desc: 'Чем вы можете помочь клиентам',
      status: `${content.services.filter(s => s.visible).length} из ${content.services.length} показано`,
      icon: '✨',
      urgent: false,
    },
    {
      href: '/admin/pricing',
      title: 'Цены',
      desc: 'Стоимость консультаций',
      status: content.pricing.length > 0 ? `${content.pricing.length} вариант(а)` : 'Не заполнено',
      icon: '💳',
      urgent: false,
    },
    {
      href: '/admin/faq',
      title: 'Вопросы и ответы',
      desc: 'Часто задаваемые вопросы',
      status: `${content.faq.filter(f => f.visible).length} вопрос(а)`,
      icon: '❓',
      urgent: false,
    },
    {
      href: '/admin/blog',
      title: 'Блог и статьи',
      desc: 'SEO-статьи, черновики, переходы на услуги',
      status: `${publishedPosts.length} опубликовано • ${content.blog.posts.filter(post => post.status === 'draft').length} черновик(ов)`,
      icon: '📝',
      urgent: false,
    },
    {
      href: '/admin/seo',
      title: 'Настройки страниц',
      desc: 'Как сайт выглядит в поисковике',
      status: content.seo.pages.home?.title ? 'Настроено' : 'Не настроено',
      icon: '🔍',
      urgent: false,
    },
  ]

  const lastUpdated = content._meta.lastUpdated
    ? new Date(content._meta.lastUpdated).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Неизвестно'

  return (
    <AdminShell specialistName={content.specialist.shortName || content.specialist.name}>
      {/* Приветствие */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Панель управления сайтом
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Последнее сохранение: {lastUpdated}
        </p>
      </div>

      {/* Подсказка если есть незаполненные поля */}
      {sections.some(s => s.urgent) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-amber-800">Есть незаполненные разделы</div>
            <div className="text-sm text-amber-700 mt-0.5">
              Рекомендуем заполнить основную информацию и контакты, чтобы сайт выглядел полным.
            </div>
          </div>
        </div>
      )}

      {/* Карточки разделов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl flex-shrink-0">{section.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 group-hover:text-[#517a63] transition-colors">
                  {section.title}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">{section.desc}</div>
                <div className={`text-xs mt-2 font-medium ${
                  section.urgent ? 'text-amber-600' : 'text-gray-400'
                }`}>
                  {section.urgent && '⚠ '}{section.status}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#517a63] transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Быстрые действия */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Открыть сайт
          </a>
          <Link
            href="/admin/general"
            className="flex items-center gap-2 px-4 py-2 bg-[#517a63]/10 rounded-xl text-sm text-[#517a63] hover:bg-[#517a63]/20 transition-colors font-medium"
          >
            Изменить основную информацию
          </Link>
        </div>
      </div>
    </AdminShell>
  )
}
