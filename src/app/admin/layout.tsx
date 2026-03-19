import type { Metadata } from 'next'
import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Панель управления сайтом',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated()
  if (!auth) {
    redirect('/manage/login')
  }

  // Загружаем данные специалиста для передачи в shell
  let specialistName = 'Психолог'
  try {
    const content = getContent()
    specialistName = content.specialist.shortName || content.specialist.name || 'Психолог'
  } catch { /* fallback */ }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
    </div>
  )
}
