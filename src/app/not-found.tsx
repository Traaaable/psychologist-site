import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <div className="font-serif text-[120px] leading-none text-[var(--color-stone-200)] mb-6">
          404
        </div>
        <h1 className="font-serif text-4xl text-[var(--color-stone-800)] mb-4">
          Страница не найдена
        </h1>
        <p className="text-[var(--color-stone-500)] mb-10 leading-relaxed">
          Кажется, такой страницы нет. Возможно, ссылка устарела или была допущена ошибка.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/">На главную</Button>
          <Button href="/contact" variant="secondary">
            Записаться на консультацию
          </Button>
        </div>
      </div>
    </section>
  )
}
