'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea,
  ListCard, ConfirmDelete, InfoTip, useSaveSection
} from '@/components/admin/AdminForm'
import type { FaqItem } from '@/lib/content'

export default function AdminFaqPage() {
  const { save, changed, setChanged } = useSaveSection('faq')
  const [loading, setLoading] = useState(true)
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setFaq(data.faq)
      setLoading(false)
    })
  }, [])

  const update = (id: string, field: string, value: unknown) => {
    setFaq(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
    setChanged(true)
  }

  const toggleVisible = (id: string) => {
    setFaq(prev => prev.map(f => f.id === id ? { ...f, visible: !f.visible } : f))
    setChanged(true)
  }

  const deleteItem = (id: string) => {
    setFaq(prev => prev.filter(f => f.id !== id))
    setDeletingId(null)
    setChanged(true)
  }

  const addItem = () => {
    const newId = `faq-${Date.now()}`
    const newItem: FaqItem = { id: newId, question: 'Новый вопрос', answer: '', visible: true }
    setFaq(prev => [...prev, newItem])
    setEditingId(newId)
    setChanged(true)
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Вопросы и ответы"
        description="Часто задаваемые вопросы, которые появляются на сайте"
        onSave={() => save(faq)}
        changed={changed}
      />

      <div className="space-y-5">
        <FormSection title="Список вопросов" description="Добавляйте вопросы, которые чаще всего задают клиенты">
          <InfoTip>
            Хорошие вопросы снижают тревогу у новых клиентов. Добавьте ответы на «Как записаться», «Сколько стоит», «Конфиденциально ли это».
          </InfoTip>

          <div className="space-y-2">
            {faq.map(item => (
              <div key={item.id}>
                <ListCard
                  title={item.question}
                  subtitle={item.answer ? `${item.answer.substring(0, 60)}...` : ''}
                  visible={item.visible}
                  onToggleVisible={() => toggleVisible(item.id)}
                  onEdit={() => setEditingId(editingId === item.id ? null : item.id)}
                  onDelete={() => setDeletingId(item.id)}
                  isExpanded={editingId === item.id}
                >
                  <div className="space-y-3">
                    <Input
                      label="Вопрос"
                      value={item.question}
                      onChange={e => update(item.id, 'question', e.target.value)}
                      placeholder="Как записаться на консультацию?"
                      hint=""
                    />
                    <Textarea
                      label="Ответ"
                      value={item.answer}
                      onChange={e => update(item.id, 'answer', e.target.value)}
                      rows={4}
                      placeholder="Напишите мне в любой мессенджер или позвоните..."
                      hint="Отвечайте просто и понятно, как будто объясняете другу."
                    />
                  </div>
                </ListCard>
                <ConfirmDelete
                  isOpen={deletingId === item.id}
                  itemName={item.question}
                  onConfirm={() => deleteItem(item.id)}
                  onCancel={() => setDeletingId(null)}
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={addItem}
            className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#517a63] hover:text-[#517a63] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Добавить вопрос
          </button>
        </FormSection>
      </div>
    </AdminShell>
  )
}
