import { useEffect, useId, useRef, useState } from 'react'

function Chevron({ open }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function SelectMenu({
  id,
  label,
  options,
  value,
  onChange,
  openUp = false,
  align = 'left',
  triggerClassName = '',
  menuClassName = '',
  labelClassName = 'editorial-label text-[9px] text-stone-400',
  valueClassName = 'text-xs font-sans font-medium text-stone-100',
  ariaLabel,
  leadingIcon,
}) {
  const [open, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(options[0]?.value)
  const selectedValue = value !== undefined ? value : uncontrolledValue
  const selected = options.find((option) => option.value === selectedValue) ?? options[0]
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === selectedValue),
    ),
  )
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const baseId = useId()
  const listId = `${baseId}-list`

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()

    function handleOutsidePointer(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    function handleDocumentKey(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleDocumentKey)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleDocumentKey)
    }
  }, [open])

  function openMenu() {
    setActiveIndex(
      Math.max(
        0,
        options.findIndex((option) => option.value === selectedValue),
      ),
    )
    setOpen(true)
  }

  function choose(index) {
    const option = options[index]
    if (!option) return
    if (value === undefined) setUncontrolledValue(option.value)
    onChange?.(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleListKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + options.length) % options.length)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            if (!open) openMenu()
          }
        }}
        className={`group flex w-full items-center justify-between gap-1.5 text-left focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:gap-2 ${triggerClassName}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {leadingIcon && (
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
                open
                  ? 'border-terracotta/40 bg-terracotta/10 text-terracotta'
                  : 'border-stone-800 bg-stone-900 text-stone-400 group-hover:text-stone-200'
              }`}
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )}
          <span className="min-w-0">
            {label && <span className={`block ${labelClassName}`}>{label}</span>}
            <span className={`block truncate ${valueClassName}`}>{selected?.label}</span>
            {selected?.hint && (
              <span className="mt-0.5 block truncate font-sans text-[10px] text-stone-500">
                {selected.hint}
              </span>
            )}
          </span>
        </span>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors md:h-6 md:w-6 ${
            open
              ? 'border-terracotta/40 bg-terracotta/10 text-terracotta'
              : 'border-stone-700/70 bg-stone-800/60 text-stone-400 group-hover:text-stone-200'
          }`}
        >
          <Chevron open={open} />
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label ?? ariaLabel}
          aria-activedescendant={`${baseId}-option-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className={`menu-enter absolute z-50 max-h-72 w-full min-w-[240px] overflow-y-auto overscroll-contain rounded-xl border border-stone-700/80 bg-stone-900/95 p-1.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl focus:outline-none ${
            openUp ? 'menu-enter-up bottom-full mb-2' : 'top-full mt-2'
          } ${align === 'right' ? 'right-0' : 'left-0'} ${menuClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue
            const isActive = index === activeIndex
            return (
              <li
                key={option.value}
                id={`${baseId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs font-sans transition-colors ${
                  isSelected
                    ? 'bg-terracotta/10 text-stone-50'
                    : isActive
                      ? 'bg-stone-800 text-stone-50'
                      : 'text-stone-300'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{option.label}</span>
                  {option.hint && (
                    <span className="mt-0.5 block truncate font-sans text-[10px] text-stone-500">
                      {option.hint}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-terracotta text-stone-50">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.8a1 1 0 0 1 1.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
