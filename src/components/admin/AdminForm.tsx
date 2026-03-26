'use client'

import { useState, useCallback } from 'react'

// ============================
// КНОПКА СОХРАНЕНИЯ
// ============================
interface SaveButtonProps {
  onSave: () => Promise<void>
  changed?: boolean
}

export function SaveButton({ onSave, changed = true }: SaveButtonProps) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const handleSave = async () => {
    setState('saving')
    try {
      await onSave()
      setState('saved')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {state === 'saved' && (
        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Сохранено!
        </span>
      )}
      {state === 'error' && (
        <span className="text-red-600 text-sm">Ошибка сохранения. Попробуйте ещё раз.</span>
      )}
      <button
        onClick={handleSave}
        disabled={state === 'saving' || !changed}
        className="px-6 py-2.5 bg-[#517a63] text-white rounded-xl font-medium text-sm hover:bg-[#3d5f4c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {state === 'saving' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Сохраняю...
          </>
        ) : (
          'Сохранить изменения'
        )}
      </button>
    </div>
  )
}

// ============================
// ПОЛЕ ВВОДА
// ============================
interface FieldProps {
  label: string
  hint?: string
  children: React.ReactNode
  required?: boolean
}

export function Field({ label, hint, children, required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{hint}</p>}
    </div>
  )
}

// ============================
// ТЕКСТОВОЕ ПОЛЕ
// ============================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function Input({ label, hint, ...props }: InputProps) {
  return (
    <Field label={label} hint={hint} required={props.required}>
      <input
        {...props}
        className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] transition bg-white disabled:bg-gray-50 disabled:text-gray-400"
      />
    </Field>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, hint, options, children, ...props }: SelectProps) {
  return (
    <Field label={label} hint={hint} required={props.required}>
      <select
        {...props}
        className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] transition bg-white disabled:bg-gray-50 disabled:text-gray-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </Field>
  )
}

// ============================
// БОЛЬШОЕ ТЕКСТОВОЕ ПОЛЕ
// ============================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function Textarea({ label, hint, ...props }: TextareaProps) {
  return (
    <Field label={label} hint={hint} required={props.required}>
      <textarea
        {...props}
        className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#517a63]/40 focus:border-[#517a63] transition bg-white resize-none"
      />
    </Field>
  )
}

// ============================
// СЕКЦИЯ ФОРМЫ
// ============================
interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function FormSection({ title, description, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-6 space-y-5">
        {children}
      </div>
    </div>
  )
}

// ============================
// ПЕРЕКЛЮЧАТЕЛЬ
// ============================
interface ToggleProps {
  label: string
  hint?: string
  checked: boolean
  onChange: (val: boolean) => void
}

export function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#517a63] focus:ring-offset-2 ${
          checked ? 'bg-[#517a63]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}
      </div>
    </div>
  )
}

// ============================
// ВЫБОР ФОРМАТА
// ============================
interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  label: string
  hint?: string
  options: RadioOption[]
  value: string
  onChange: (val: string) => void
}

export function RadioGroup({ label, hint, options, value, onChange }: RadioGroupProps) {
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2 mt-1">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
              value === opt.value
                ? 'border-[#517a63] bg-[#517a63]/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              value === opt.value ? 'border-[#517a63]' : 'border-gray-300'
            }`}>
              {value === opt.value && (
                <div className="w-2 h-2 rounded-full bg-[#517a63]" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">{opt.label}</div>
              {opt.description && <div className="text-xs text-gray-400">{opt.description}</div>}
            </div>
          </button>
        ))}
      </div>
    </Field>
  )
}

// ============================
// ЗАГОЛОВОК СТРАНИЦЫ АДМИНКИ
// ============================
interface PageHeaderProps {
  title: string
  description?: string
  onSave?: () => Promise<void>
  changed?: boolean
}

export function AdminPageHeader({ title, description, onSave, changed }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {onSave && <SaveButton onSave={onSave} changed={changed} />}
    </div>
  )
}

// ============================
// КАРТОЧКА-ЭЛЕМЕНТ СПИСКА
// ============================
interface ListCardProps {
  title: string
  subtitle?: string
  onEdit?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  visible?: boolean
  onToggleVisible?: () => void
  children?: React.ReactNode
  isExpanded?: boolean
}

export function ListCard({
  title, subtitle, onEdit, onDelete, visible = true,
  onToggleVisible, children, isExpanded, onMoveUp, onMoveDown
}: ListCardProps) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Drag handle заглушка */}
        <div className="flex flex-col gap-0.5 cursor-grab flex-shrink-0 opacity-30">
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-0.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${visible ? 'text-gray-800' : 'text-gray-400'}`}>
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {(onMoveUp || onMoveDown) && (
            <>
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="p-2 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Поднять выше"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
              )}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="p-2 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Опустить ниже"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25L12 15.75 4.5 8.25" />
                  </svg>
                </button>
              )}
            </>
          )}
          {onToggleVisible && (
            <button
              onClick={onToggleVisible}
              title={visible ? 'Скрыть на сайте' : 'Показать на сайте'}
              className={`p-2 rounded-lg transition-colors ${
                visible
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-300 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {visible
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                }
                {visible && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Удалить"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {children && isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ============================
// ДИАЛОГ ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ
// ============================
interface ConfirmDeleteProps {
  isOpen: boolean
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDelete({ isOpen, itemName, onConfirm, onCancel }: ConfirmDeleteProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-center font-semibold text-gray-900 mb-2">Удалить элемент?</h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          «{itemName}» будет удалён. Это действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 rounded-xl text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================
// ИНФОРМАЦИОННАЯ ПОДСКАЗКА
// ============================
export function InfoTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <p className="text-xs text-blue-700 leading-relaxed">{children}</p>
    </div>
  )
}

// ============================
// ХУК ДЛЯ СОХРАНЕНИЯ СЕКЦИИ
// ============================
export function useSaveSection(section: string) {
  const [changed, setChanged] = useState(false)

  const save = useCallback(async (data: unknown) => {
    console.info('[admin-debug] save-section:start', {
      section,
      payloadType: Array.isArray(data) ? 'array' : typeof data,
    })
    const res = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('[admin-debug] save-section:error', {
        section,
        status: res.status,
        error: err.error,
      })
      throw new Error(err.error || 'Ошибка сохранения')
    }
    console.info('[admin-debug] save-section:success', {
      section,
      status: res.status,
    })
    setChanged(false)
  }, [section])

  return { changed, setChanged, save }
}
