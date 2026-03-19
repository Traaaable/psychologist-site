'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea, InfoTip, useSaveSection
} from '@/components/admin/AdminForm'

const PAGE_LABELS: Record<string, string> = {
  home: 'Главная страница',
  about: 'Страница «Обо мне»',
  services: 'Страница «Направления»',
  pricing: 'Страница «Цены»',
  contact: 'Страница «Контакты»',
}

export default function AdminSeoPage() {
  const { save, changed, setChanged } = useSaveSection('seo')
  const [loading, setLoading] = useState(true)
  const [seo, setSeo] = useState({
    siteName: '',
    siteUrl: '',
    defaultDescription: '',
    pages: {} as Record<string, { title: string; description: string }>,
  })

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setSeo(data.seo)
      setLoading(false)
    })
  }, [])

  const updateField = (field: string, value: string) => {
    setSeo(prev => ({ ...prev, [field]: value }))
    setChanged(true)
  }

  const updatePage = (pageKey: string, field: 'title' | 'description', value: string) => {
    setSeo(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: { ...prev.pages[pageKey], [field]: value },
      },
    }))
    setChanged(true)
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Настройки страниц"
        description="Как ваш сайт выглядит в поисковых системах (Яндекс, Google)"
        onSave={() => save(seo)}
        changed={changed}
      />

      <div className="space-y-5">
        <FormSection title="Общие настройки сайта">
          <InfoTip>
            Эти настройки влияют на то, как ваш сайт показывается в поисковике. Заполните их один раз — потом менять придётся редко.
          </InfoTip>

          <Input
            label="Название сайта"
            value={seo.siteName}
            onChange={e => updateField('siteName', e.target.value)}
            placeholder="Нестерова Лариса Васильевна — психолог"
            hint="Отображается в заголовке вкладки браузера и в результатах поиска."
          />
          <Input
            label="Адрес сайта в интернете"
            value={seo.siteUrl}
            onChange={e => updateField('siteUrl', e.target.value)}
            placeholder="https://ваш-сайт.ru"
            hint="Полный адрес вашего сайта. Нужен для корректной работы поисковиков."
          />
          <Textarea
            label="Общее описание сайта"
            value={seo.defaultDescription}
            onChange={e => updateField('defaultDescription', e.target.value)}
            rows={3}
            placeholder="Индивидуальные консультации психолога в Омске. Помогаю справиться с тревожностью, выгоранием, кризисами."
            hint="2–3 предложения о вашей работе. Отображается в результатах поиска, если для конкретной страницы не задано своё описание."
          />
        </FormSection>

        {/* Настройки для каждой страницы */}
        {Object.entries(PAGE_LABELS).map(([key, label]) => (
          <FormSection
            key={key}
            title={label}
            description="Заголовок и описание именно для этой страницы"
          >
            <Input
              label="Заголовок страницы (в поиске)"
              value={seo.pages[key]?.title || ''}
              onChange={e => updatePage(key, 'title', e.target.value)}
              placeholder={`Психолог в Омске — ${label}`}
              hint="До 60 символов. Это первая строка в результатах поиска."
            />
            <Textarea
              label="Описание страницы (в поиске)"
              value={seo.pages[key]?.description || ''}
              onChange={e => updatePage(key, 'description', e.target.value)}
              rows={2}
              placeholder="Краткое описание страницы для поисковика..."
              hint="До 160 символов. Текст под заголовком в результатах поиска."
            />
          </FormSection>
        ))}
      </div>
    </AdminShell>
  )
}
