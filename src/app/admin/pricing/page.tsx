'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea,
  Toggle, ListCard, ConfirmDelete, InfoTip, useSaveSection
} from '@/components/admin/AdminForm'
import type { PricingItem } from '@/lib/content'

export default function AdminPricingPage() {
  const { save, changed, setChanged } = useSaveSection('pricing')
  const [loading, setLoading] = useState(true)
  const [pricing, setPricing] = useState<PricingItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setPricing(data.pricing)
      setLoading(false)
    })
  }, [])

  const update = (id: string, field: string, value: unknown) => {
    setPricing(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    setChanged(true)
  }

  const updateFeatures = (id: string, raw: string) => {
    const features = raw.split('\n').map(s => s.trim()).filter(Boolean)
    update(id, 'features', features)
  }

  const toggleVisible = (id: string) => {
    setPricing(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p))
    setChanged(true)
  }

  const setPopular = (id: string) => {
    setPricing(prev => prev.map(p => ({ ...p, isPopular: p.id === id })))
    setChanged(true)
  }

  const deletePlan = (id: string) => {
    setPricing(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
    setChanged(true)
  }

  const addPlan = () => {
    const newId = `plan-${Date.now()}`
    const newItem: PricingItem = {
      id: newId, title: 'Новый вариант', price: '', duration: '60 минут',
      description: '', features: [], isPopular: false, visible: true
    }
    setPricing(prev => [...prev, newItem])
    setEditingId(newId)
    setChanged(true)
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Цены"
        description="Стоимость консультаций — разовые и пакеты"
        onSave={() => save(pricing)}
        changed={changed}
      />

      <div className="space-y-5">
        <FormSection
          title="Варианты консультаций"
          description="Добавьте один или несколько вариантов — разовая сессия, пакет сессий и т.д."
        >
          <InfoTip>
            Если вы ещё не определились с ценой — оставьте поле «Стоимость» пустым или напишите «Уточняется». Клиент увидит именно то, что вы написали.
          </InfoTip>

          <div className="space-y-2">
            {pricing.map(plan => (
              <div key={plan.id}>
                <ListCard
                  title={plan.title}
                  subtitle={plan.price ? `${plan.price} ₽ · ${plan.duration}` : plan.duration}
                  visible={plan.visible}
                  onToggleVisible={() => toggleVisible(plan.id)}
                  onEdit={() => setEditingId(editingId === plan.id ? null : plan.id)}
                  onDelete={() => setDeletingId(plan.id)}
                  isExpanded={editingId === plan.id}
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Название" value={plan.title} onChange={e => update(plan.id, 'title', e.target.value)} placeholder="Разовая консультация" hint="" />
                      <Input label="Стоимость (только цифры или текст)" value={plan.price} onChange={e => update(plan.id, 'price', e.target.value)} placeholder="3 500" hint="Только число, без ₽. Или напишите «Уточняется»" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Продолжительность" value={plan.duration} onChange={e => update(plan.id, 'duration', e.target.value)} placeholder="60 минут" hint="" />
                      <Input label="Краткое описание" value={plan.description} onChange={e => update(plan.id, 'description', e.target.value)} placeholder="Индивидуальная сессия" hint="" />
                    </div>
                    <Textarea
                      label="Что входит (каждый пункт с новой строки)"
                      value={plan.features.join('\n')}
                      onChange={e => updateFeatures(plan.id, e.target.value)}
                      rows={4}
                      hint="Каждый пункт — с новой строки. Например:&#10;Индивидуальная сессия&#10;Анализ запроса&#10;Рекомендации"
                    />
                    <Toggle
                      label="Выделить как «Популярный выбор»"
                      hint="Добавит зелёную метку на эту карточку. Только одна карточка может быть популярной."
                      checked={plan.isPopular}
                      onChange={() => setPopular(plan.id)}
                    />
                  </div>
                </ListCard>
                <ConfirmDelete
                  isOpen={deletingId === plan.id}
                  itemName={plan.title}
                  onConfirm={() => deletePlan(plan.id)}
                  onCancel={() => setDeletingId(null)}
                />
              </div>
            ))}
          </div>

          <button type="button" onClick={addPlan}
            className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#517a63] hover:text-[#517a63] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Добавить вариант
          </button>
        </FormSection>
      </div>
    </AdminShell>
  )
}
