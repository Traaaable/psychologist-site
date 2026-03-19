import { getContent } from '@/lib/content'
import { Footer } from './Footer'

export async function FooterWrapper() {
  let props = {
    name: 'Психолог',
    description: '',
    telegram: '',
    whatsapp: '',
    phone: '',
    email: '',
    location: '',
    workingHours: '',
  }

  try {
    const content = getContent()
    const city = content.location.city
    const address = content.location.showAddress && content.location.address
      ? `${city}, ${content.location.address}`
      : city

    props = {
      name: content.specialist.shortName || content.specialist.name,
      description: content.about.mainText,
      telegram: content.contacts.telegram,
      whatsapp: content.contacts.whatsapp,
      phone: content.contacts.phone,
      email: content.contacts.email,
      location: address,
      workingHours: content.contacts.workingHours,
    }
  } catch { /* fallback */ }

  return <Footer {...props} />
}
