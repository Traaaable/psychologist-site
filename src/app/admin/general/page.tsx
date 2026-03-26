'use client'

import { useState, useEffect, useRef } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea,
  InfoTip, useSaveSection
} from '@/components/admin/AdminForm'

export default function AdminGeneralPage() {
  const { save, changed, setChanged } = useSaveSection('specialist')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    shortName: '',
    title: '',
    tagline: '',
    experience: '',
    sessionsCount: '',
    photo: '',
    heroText: '',
    heroSubtitle: '',
  })

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        setForm(data.specialist)
        setLoading(false)
      })
  }, [])

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setChanged(true)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        update('photo', data.url)
      } else {
        alert(data.error || 'Не удалось загрузить фото')
      }
    } catch {
      alert('Ошибка при загрузке файла')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Загружаем данные...</div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Основная информация"
        description="ФИО, фото и главный текст на первой странице сайта"
        onSave={() => save(form)}
        changed={changed}
      />

      <div className="space-y-5">
        {/* Фото и имя */}
        <FormSection title="О специалисте" description="Эти данные отображаются на главной и странице «Обо мне»">
          {/* Фото */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фотография</label>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {form.photo ? (
                  <img src={form.photo} alt="Фото" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Загружаем...' : form.photo ? 'Заменить фото' : 'Загрузить фото'}
                </button>
                <p className="text-xs text-gray-400 mt-1.5">
                  Любой формат изображения, не более 15 МБ
                </p>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => update('photo', '')}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 block"
                  >
                    Удалить фото
                  </button>
                )}
              </div>
            </div>
          </div>

          <Input
            label="Полное имя (ФИО)"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Нестерова Лариса Васильевна"
            hint="Будет отображаться на странице «Обо мне» и в заголовке сайта"
          />

          <Input
            label="Короткое имя"
            value={form.shortName}
            onChange={e => update('shortName', e.target.value)}
            placeholder="Лариса Нестерова"
            hint="Используется в хедере сайта и коротких описаниях"
          />

          <Input
            label="Должность / специализация"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Психолог-консультант"
            hint="Например: Психолог-консультант, гештальт-терапевт"
          />

          <Input
            label="Подзаголовок о специализации"
            value={form.tagline}
            onChange={e => update('tagline', e.target.value)}
            placeholder="Психолог-консультант, специалист в области личностного развития"
            hint="Полная строка с описанием — показывается на странице «Обо мне»"
          />
        </FormSection>

        {/* Опыт */}
        <FormSection title="Опыт и статистика" description="Цифры, которые показываются на главной странице">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Опыт работы"
              value={form.experience}
              onChange={e => update('experience', e.target.value)}
              placeholder="9 лет"
              hint="Например: 9 лет, более 5 лет"
            />
            <Input
              label="Количество консультаций"
              value={form.sessionsCount}
              onChange={e => update('sessionsCount', e.target.value)}
              placeholder="500+"
              hint="Например: 500+, более 300"
            />
          </div>
        </FormSection>

        {/* Главный экран */}
        <FormSection
          title="Первый экран сайта (главная страница)"
          description="Это первое, что видит посетитель когда заходит на сайт"
        >
          <InfoTip>
            Этот текст очень важен — именно он создаёт первое впечатление. Пишите просто и тепло, от первого лица.
          </InfoTip>

          <Input
            label="Главный заголовок"
            value={form.heroText}
            onChange={e => update('heroText', e.target.value)}
            placeholder="Пространство, где можно быть собой"
            hint="Большой заголовок на первой странице. 3–6 слов, тёплые и понятные."
          />

          <Textarea
            label="Подзаголовок"
            value={form.heroSubtitle}
            onChange={e => update('heroSubtitle', e.target.value)}
            rows={3}
            placeholder="Индивидуальные консультации психолога. Работаю с тревогой, выгоранием, отношениями и жизненными кризисами. Без спешки, без осуждения."
            hint="Краткое описание вашей работы — 2-3 предложения. Что вы делаете и для кого."
          />
        </FormSection>
      </div>
    </AdminShell>
  )
}
