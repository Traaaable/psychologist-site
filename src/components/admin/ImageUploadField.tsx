'use client'

import { useRef, useState } from 'react'
import { Field } from '@/components/admin/AdminForm'

interface ImageUploadFieldProps {
  label: string
  value?: string
  hint?: string
  onChange: (url: string) => void
  altLabel?: string
  altValue?: string
  onAltChange?: (value: string) => void
}

export function ImageUploadField({
  label,
  value = '',
  hint,
  onChange,
  altLabel = 'Alt-текст',
  altValue = '',
  onAltChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Не удалось загрузить изображение')
      }

      onChange(payload.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить изображение')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/uploads/cover.jpg"
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] transition bg-white"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {uploading ? 'Загружаю...' : 'Загрузить'}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Убрать
              </button>
            ) : null}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {onAltChange ? (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">{altLabel}</span>
            <input
              value={altValue}
              onChange={(event) => onAltChange(event.target.value)}
              placeholder="Коротко опишите, что изображено"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] transition bg-white"
            />
          </label>
        ) : null}

        {value ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <img src={value} alt={altValue || 'Предпросмотр изображения'} className="max-h-64 w-full object-cover" />
          </div>
        ) : null}

        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : null}
      </div>
    </Field>
  )
}
