'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  AdminPageHeader, FormSection, Input, Toggle,
  RadioGroup, InfoTip, useSaveSection
} from '@/components/admin/AdminForm'

type Format = 'offline' | 'online' | 'both'

export default function AdminContactsPage() {
  const contactsSave = useSaveSection('contacts')
  const locationSave = useSaveSection('location')
  const [loading, setLoading] = useState(true)

  const [contacts, setContacts] = useState({
    phone: '', email: '', telegram: '', whatsapp: '', vk: '', workingHours: '',
  })
  const [location, setLocation] = useState({
    city: '', address: '', showAddress: false,
    consultationFormat: 'offline' as Format, formatNote: '',
  })

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(data => {
      setContacts(data.contacts)
      setLocation(data.location)
      setLoading(false)
    })
  }, [])

  const updateContacts = (field: string, value: string) => {
    setContacts(prev => ({ ...prev, [field]: value }))
    contactsSave.setChanged(true)
  }
  const updateLocation = (field: string, value: unknown) => {
    setLocation(prev => ({ ...prev, [field]: value }))
    locationSave.setChanged(true)
  }

  const handleSaveAll = async () => {
    await Promise.all([
      contactsSave.changed ? contactsSave.save(contacts) : Promise.resolve(),
      locationSave.changed ? locationSave.save(location) : Promise.resolve(),
    ])
  }

  if (loading) {
    return <AdminShell><div className="flex items-center justify-center h-64 text-gray-400">Загружаем данные...</div></AdminShell>
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Контакты и место приёма"
        description="Телефон, мессенджеры, город и адрес офиса"
        onSave={handleSaveAll}
        changed={contactsSave.changed || locationSave.changed}
      />

      <div className="space-y-5">
        {/* Место приёма */}
        <FormSection title="Место приёма" description="Где проходят консультации">
          <Input
            label="Город"
            value={location.city}
            onChange={e => updateLocation('city', e.target.value)}
            placeholder="Омск"
            hint="Название города, в котором вы принимаете. Отображается на сайте."
          />

          <RadioGroup
            label="Формат консультаций"
            options={[
              { value: 'offline', label: 'Только очно', description: 'Приём только в офисе' },
              { value: 'online', label: 'Только онлайн', description: 'Работа через видеосвязь' },
              { value: 'both', label: 'Очно + онлайн', description: 'Клиент выбирает сам' },
            ]}
            value={location.consultationFormat}
            onChange={v => updateLocation('consultationFormat', v)}
          />

          <Input
            label="Адрес офиса"
            value={location.address}
            onChange={e => updateLocation('address', e.target.value)}
            placeholder="ул. Ленина, 15, офис 203"
            hint="Конкретный адрес для очных встреч. Можно оставить пустым — тогда будет показан только город."
          />

          <Toggle
            label="Показывать полный адрес на сайте"
            hint="Если выключить — на сайте будет показан только город, без конкретного адреса."
            checked={location.showAddress}
            onChange={v => updateLocation('showAddress', v)}
          />

          {!location.showAddress && location.address && (
            <InfoTip>
              Адрес сохранён, но не отображается на сайте. Включите переключатель выше, чтобы показать его посетителям.
            </InfoTip>
          )}

          <Input
            label="Примечание о формате"
            value={location.formatNote}
            onChange={e => updateLocation('formatNote', e.target.value)}
            placeholder="Очный приём в офисе"
            hint="Короткая заметка, которая отображается рядом с форматом. Например: «Очный приём в офисе» или «Приём онлайн, по всей России»"
          />
        </FormSection>

        {/* Контакты */}
        <FormSection title="Способы связи" description="Как клиенты могут с вами связаться">
          <Input
            label="Телефон"
            value={contacts.phone}
            onChange={e => updateContacts('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
            type="tel"
            hint="Будет показан на сайте. Клиенты смогут нажать и позвонить."
          />
          <Input
            label="Email"
            value={contacts.email}
            onChange={e => updateContacts('email', e.target.value)}
            placeholder="larisa@mail.ru"
            type="email"
            hint="Адрес электронной почты для связи."
          />
          <Input
            label="Telegram"
            value={contacts.telegram}
            onChange={e => updateContacts('telegram', e.target.value)}
            placeholder="https://t.me/ваш_ник"
            hint="Ссылка на Telegram. Например: https://t.me/larisa_psy"
          />
          <Input
            label="WhatsApp"
            value={contacts.whatsapp}
            onChange={e => updateContacts('whatsapp', e.target.value)}
            placeholder="https://wa.me/79991234567"
            hint="Ссылка на WhatsApp. Формат: https://wa.me/7XXXXXXXXXX (без пробелов, тире)"
          />
          <Input
            label="ВКонтакте"
            value={contacts.vk}
            onChange={e => updateContacts('vk', e.target.value)}
            placeholder="https://vk.com/ваш_профиль"
            hint="Ссылка на страницу ВКонтакте (необязательно)"
          />
          <Input
            label="Часы работы"
            value={contacts.workingHours}
            onChange={e => updateContacts('workingHours', e.target.value)}
            placeholder="Пн–Пт: 10:00–20:00, Сб: 11:00–17:00"
            hint="Когда вы принимаете или отвечаете на сообщения."
          />
        </FormSection>
      </div>
    </AdminShell>
  )
}
