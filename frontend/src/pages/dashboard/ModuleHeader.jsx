import { useEffect, useState } from 'react'

export default function ModuleHeader({
  eyebrow,
  title,
  description,
  actions,
  notification = false,
}) {
  const [shown, setShown] = useState(!notification)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!notification) return undefined

    const frame = window.requestAnimationFrame(() => setShown(true))
    const hideTimer = window.setTimeout(() => setShown(false), 3000)
    const removeTimer = window.setTimeout(() => setVisible(false), 3350)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(hideTimer)
      window.clearTimeout(removeTimer)
    }
  }, [notification])

  if (!visible) return null

  const header = (
    <header
      className={
        notification
          ? 'flex flex-col gap-2.5 rounded-xl border border-terracotta-hover/60 bg-terracotta px-4 py-3 shadow-2xl md:flex-row md:items-center md:justify-between'
          : 'flex flex-col gap-2.5 border-b border-stone-800/80 pb-3 pt-3 md:flex-row md:items-center md:justify-between lg:sticky lg:top-0 lg:z-30 lg:-mx-10 lg:bg-stone-950/95 lg:px-10 lg:pb-3 lg:pt-3 lg:backdrop-blur-md'
      }
    >
      <div className="min-w-0">
        <span
          className={`editorial-label ${notification ? 'text-stone-50/80' : 'text-stone-500'}`}
        >
          {eyebrow}
        </span>
        <h1 className="mt-0.5 text-xl font-bold tracking-tight text-stone-50">{title}</h1>
        {description && (
          <p
            className={`mt-1 max-w-3xl font-sans text-[11px] font-light leading-relaxed ${
              notification ? 'text-stone-50/90' : 'text-stone-400'
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">{actions}</div>
      )}
    </header>
  )

  if (!notification) return header

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 px-5 pt-3 sm:px-8 lg:px-10">
      <div
        className={`transition-all duration-300 ease-out ${
          shown ? 'translate-y-0 opacity-100' : '-translate-y-[140%] opacity-0'
        }`}
      >
        {header}
      </div>
    </div>
  )
}
