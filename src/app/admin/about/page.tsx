'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea,
  InfoTip, ListCard, ConfirmDelete, useSaveSection, SaveButton
} from '@/components/admin/AdminForm'
import type { EducationItem, CertificateItem } from '@/lib/content'

function generateId() {
  return `item-${Date.now()}`
}

export default function AdminAboutPage() {
  const aboutSave = useSaveSection('about')
  const eduSave = useSaveSection('education')
  const certSave = useSaveSection('certificates')
  const [loading, setLoading] = useState(true)

  const [about, setAbout] = useState({ mainText: '', approach: '', values: '', quote: '' })
  const [education, setEducation] = useState<EducationItem[]>([])
  const [certificates, setCertificates] = useState<CertificateItem[]>([])

  // Редактирование образования
  const [editingEdu, setEditingEdu] = useState<string | null>(null)
  const [editingCert, setEditingCert] = useState<string | null>(null)
  const [deletingEdu, setDeletingEdu] = useState<string | null>(null)
  const [deletingCert, setDeletingCert] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setAbout(data.about)
      setEducation(data.education)
      setCertificates(data.certificates)
      setLoading(false)
    })
  }, [])

  const updateAbout = (field: string, value: string) => {
    setAbout(prev => ({ ...prev, [field]: value }))
    aboutSave.setChanged(true)
  }

  // --- Образование ---
  const addEdu = () => {
    const newItem: EducationItem = {
      id: generateId(), year: '', institution: 'Новое учебное заведение', description: '', type: 'education'
    }
    const updated = [...education, newItem]
    setEducation(updated)
    setEditingEdu(newItem.id)
    eduSave.setChanged(true)
  }

  const updateEdu = (id: string, field: string, value: string) => {
    setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    eduSave.setChanged(true)
  }

  const deleteEdu = (id: string) => {
    setEducation(prev => prev.filter(e => e.id !== id))
    setDeletingEdu(null)
    eduSave.setChanged(true)
  }

  // --- Сертификаты ---
  const addCert = () => {
    const newItem: CertificateItem = {
      id: generateId(), year: '', title: 'Новый сертификат', description: ''
    }
    const updated = [...certificates, newItem]
    setCertificates(updated)
    setEditingCert(newItem.id)
    certSave.setChanged(true)
  }

  const updateCert = (id: string, field: string, value: string) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    certSave.setChanged(true)
  }

  const deleteCert = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id))
    setDeletingCert(null)
    certSave.setChanged(true)
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Обо мне"
        description="Текст о вас, ваш подход к работе, образование и сертификаты"
        onSave={() => aboutSave.save(about)}
        changed={aboutSave.changed}
      />

      <div className="space-y-5">
        {/* Основной текст */}
        <FormSection title="Текст «Обо мне»" description="Что увидят посетители на странице «Обо мне»">
          <InfoTip>
            Пишите от первого лица, простым и тёплым языком. Расскажите, кем вы работаете и чем помогаете — без сложных терминов.
          </InfoTip>
          <Textarea
            label="Основной текст"
            value={about.mainText}
            onChange={e => updateAbout('mainText', e.target.value)}
            rows={4}
            placeholder="Практикующий психолог. Помогаю взрослым людям справляться с трудностями..."
            hint="2–4 предложения о том, кто вы и чем занимаетесь."
          />
          <Textarea
            label="Мой подход к работе"
            value={about.approach}
            onChange={e => updateAbout('approach', e.target.value)}
            rows={4}
            placeholder="Работаю в интегративном подходе..."
            hint="Как именно вы работаете с клиентами, какие методы используете."
          />
          <Textarea
            label="Мои ценности"
            value={about.values}
            onChange={e => updateAbout('values', e.target.value)}
            rows={3}
            placeholder="Я верю, что каждый человек способен найти свой путь..."
            hint="Что для вас важно в работе с людьми."
          />
          <Input
            label="Цитата о вашей работе"
            value={about.quote}
            onChange={e => updateAbout('quote', e.target.value)}
            placeholder="Терапия — это не про то, чтобы стать другим человеком..."
            hint="Короткая цитата или мысль, которая отображается выделенным блоком на странице."
          />
        </FormSection>

        {/* Образование */}
        <FormSection
          title="Образование"
          description="Учебные заведения, дипломы, курсы подготовки"
        >
          <InfoTip>
            Добавьте ваше образование — университет, факультет, год окончания. Каждый пункт — отдельная запись.
          </InfoTip>

          <div className="space-y-2">
            {education.map(item => (
              <div key={item.id}>
                <ListCard
                  title={item.institution || 'Без названия'}
                  subtitle={item.year ? `${item.year}${item.description ? ` · ${item.description}` : ''}` : item.description}
                  onEdit={() => setEditingEdu(editingEdu === item.id ? null : item.id)}
                  onDelete={() => setDeletingEdu(item.id)}
                  isExpanded={editingEdu === item.id}
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Год / период" value={item.year} onChange={e => updateEdu(item.id, 'year', e.target.value)} placeholder="2015" hint="" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип</label>
                        <select
                          value={item.type}
                          onChange={e => updateEdu(item.id, 'type', e.target.value)}
                          className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] bg-white"
                        >
                          <option value="education">Образование</option>
                          <option value="practice">Практика / стажировка</option>
                        </select>
                      </div>
                    </div>
                    <Input label="Учебное заведение" value={item.institution} onChange={e => updateEdu(item.id, 'institution', e.target.value)} placeholder="МГУ им. М.В. Ломоносова" hint="" />
                    <Input label="Факультет / специализация" value={item.description} onChange={e => updateEdu(item.id, 'description', e.target.value)} placeholder="Факультет психологии — специалист" hint="" />
                  </div>
                </ListCard>
                <ConfirmDelete
                  isOpen={deletingEdu === item.id}
                  itemName={item.institution}
                  onConfirm={() => deleteEdu(item.id)}
                  onCancel={() => setDeletingEdu(null)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={addEdu}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#517a63] hover:text-[#517a63] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить место учёбы
            </button>
            <SaveButton onSave={() => eduSave.save(education)} changed={eduSave.changed} />
          </div>
        </FormSection>

        {/* Сертификаты */}
        <FormSection
          title="Сертификаты и дополнительное обучение"
          description="Курсы повышения квалификации, тренинги, сертификации"
        >
          <div className="space-y-2">
            {certificates.map(item => (
              <div key={item.id}>
                <ListCard
                  title={item.title || 'Без названия'}
                  subtitle={item.year ? `${item.year}${item.description ? ` · ${item.description}` : ''}` : item.description}
                  onEdit={() => setEditingCert(editingCert === item.id ? null : item.id)}
                  onDelete={() => setDeletingCert(item.id)}
                  isExpanded={editingCert === item.id}
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Год" value={item.year} onChange={e => updateCert(item.id, 'year', e.target.value)} placeholder="2020" hint="" />
                      <Input label="Название сертификата / курса" value={item.title} onChange={e => updateCert(item.id, 'title', e.target.value)} placeholder="Гештальт-терапия" hint="" />
                    </div>
                    <Input label="Описание" value={item.description} onChange={e => updateCert(item.id, 'description', e.target.value)} placeholder="Полная программа подготовки" hint="" />
                  </div>
                </ListCard>
                <ConfirmDelete
                  isOpen={deletingCert === item.id}
                  itemName={item.title}
                  onConfirm={() => deleteCert(item.id)}
                  onCancel={() => setDeletingCert(null)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={addCert}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#517a63] hover:text-[#517a63] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Добавить сертификат
            </button>
            <SaveButton onSave={() => certSave.save(certificates)} changed={certSave.changed} />
          </div>
        </FormSection>
      </div>
    </AdminShell>
  )
}
