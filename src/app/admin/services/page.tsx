'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Textarea,
  ListCard, ConfirmDelete, InfoTip, useSaveSection
} from '@/components/admin/AdminForm'
import type { ServiceItem } from '@/lib/content'

export default function AdminServicesPage() {
  const { save, changed, setChanged } = useSaveSection('services')
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ServiceItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setServices(data.services)
      setLoading(false)
    })
  }, [])

  const update = (id: string, field: string, value: unknown) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
    setChanged(true)
  }

  const toggleVisible = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
    setChanged(true)
  }

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
    setChanged(true)
  }

  const addService = () => {
    const newId = `service-${Date.now()}`
    const newItem: ServiceItem = {
      id: newId, title: 'Новое направление', shortDesc: '', fullDesc: '', icon: 'star', visible: true
    }
    setServices(prev => [...prev, newItem])
    setEditingId(newId)
    setChanged(true)
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Направления работы"
        description="С чем вы помогаете клиентам — тревога, выгорание, отношения и другое"
        onSave={() => save(services)}
        changed={changed}
      />

      <div className="space-y-5">
        <FormSection
          title="Список направлений"
          description="Каждое направление отображается отдельной карточкой на сайте"
        >
          <InfoTip>
            Включите только те направления, с которыми вы реально работаете. Скрытые карточки не исчезают — их можно включить в любой момент.
          </InfoTip>

          <div className="space-y-2">
            {services.map(service => (
              <div key={service.id}>
                <ListCard
                  title={service.title}
                  subtitle={service.shortDesc}
                  visible={service.visible}
                  onToggleVisible={() => toggleVisible(service.id)}
                  onEdit={() => setEditingId(editingId === service.id ? null : service.id)}
                  onDelete={() => setDeletingId(service.id)}
                  isExpanded={editingId === service.id}
                >
                  <div className="space-y-3">
                    <Input
                      label="Название направления"
                      value={service.title}
                      onChange={e => update(service.id, 'title', e.target.value)}
                      placeholder="Тревога и тревожность"
                      hint=""
                    />
                    <Input
                      label="Короткое описание (для карточки)"
                      value={service.shortDesc}
                      onChange={e => update(service.id, 'shortDesc', e.target.value)}
                      placeholder="Постоянное беспокойство, страхи, панические атаки"
                      hint="1–2 строки. Отображается на карточке на главной странице."
                    />
                    <Textarea
                      label="Подробное описание"
                      value={service.fullDesc}
                      onChange={e => update(service.id, 'fullDesc', e.target.value)}
                      rows={3}
                      placeholder="Помогаю справиться с хронической тревогой..."
                      hint="Несколько предложений о том, как именно вы работаете с этой темой."
                    />
                  </div>
                </ListCard>
                <ConfirmDelete
                  isOpen={deletingId === service.id}
                  itemName={service.title}
                  onConfirm={() => deleteService(service.id)}
                  onCancel={() => setDeletingId(null)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addService}
            className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#517a63] hover:text-[#517a63] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить направление
          </button>
        </FormSection>
      </div>
    </AdminShell>
  )
}
