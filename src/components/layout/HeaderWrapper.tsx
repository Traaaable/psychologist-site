// Серверный компонент — читает контент и передаёт в клиентский Header
import { getContent } from '@/lib/content'
import { Header } from './Header'
import { NAV_LINKS } from '@/lib/constants'

export async function HeaderWrapper() {
  let name = 'Психолог'
  let phone = ''

  try {
    const content = getContent()
    name = content.specialist.shortName || content.specialist.name || 'Психолог'
    phone = content.contacts.phone
  } catch { /* fallback */ }

  return <Header specialistName={name} phone={phone} navLinks={NAV_LINKS} />
}
