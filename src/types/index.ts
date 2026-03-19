// ============================
// ОБЩИЕ ТИПЫ ПРОЕКТА
// ============================

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content?: string
  date: string
  updatedAt?: string
  readTime: string
  category: string
  tags?: string[]
  image?: string
  author?: string
  seo?: {
    title?: string
    description?: string
  }
}

export interface Service {
  id: string
  slug: string
  title: string
  shortDesc: string
  fullDesc?: string
  icon: string
  color: string
  signs?: string[]
  metaTitle?: string
  metaDescription?: string
}

export interface PricePlan {
  id: string
  title: string
  price: string
  pricePerSession?: string
  duration: string
  format: string
  features: string[]
  isPopular: boolean
}

export interface FAQItem {
  id: number
  question: string
  answer: string
  category?: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  date: string
  rating?: number
  category?: string
}

export interface NavLink {
  href: string
  label: string
  children?: NavLink[]
}

// Форма обратной связи
export interface ContactFormData {
  name: string
  phone?: string
  email?: string
  message?: string
  format?: 'online' | 'offline' | ''
  consent: boolean
}

// Ответ формы
export interface FormResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
}
