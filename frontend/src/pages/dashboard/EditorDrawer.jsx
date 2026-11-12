import { useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function EditorDrawer({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t('Cerrar editor', 'Close editor')}
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        className="relative flex h-full w-full max-w-[580px] flex-col border-l border-stone-800 bg-stone-950 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-stone-800 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            {eyebrow && <span className="editorial-label text-stone-500">{eyebrow}</span>}
            <h2
              id="editor-title"
              className="mt-1.5 text-lg font-bold tracking-tight text-stone-50"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 font-sans text-[11px] font-light leading-relaxed text-stone-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Cerrar', 'Close')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-stone-800 text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-100"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-stone-800 bg-stone-950 px-5 py-4 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
