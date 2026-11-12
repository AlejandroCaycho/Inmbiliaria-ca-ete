import { useLanguage } from '../../context/LanguageContext'
import { realImages } from '../../data/images'

export const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50'

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-2.5 font-sans text-xs font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50 disabled:cursor-not-allowed disabled:opacity-50'

export const smallButton =
  'inline-flex items-center justify-center gap-1.5 rounded-md border border-stone-700 bg-stone-900/40 px-2.5 py-1.5 font-sans text-[10px] font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50 disabled:cursor-not-allowed disabled:opacity-40'

export const smallPrimaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-md bg-terracotta px-2.5 py-1.5 font-sans text-[10px] font-semibold text-stone-50 transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-40'

export const dangerButton =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-red-900/60 px-4 py-2.5 font-sans text-xs font-medium text-red-300/90 transition-colors hover:border-red-700 hover:text-red-200'

export function FormSection({ title, description, children }) {
  return (
    <section className="border-b border-stone-800 pb-6 last:border-0 last:pb-0">
      <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 font-sans text-[10px] font-light leading-relaxed text-stone-600">
          {description}
        </p>
      )}
      <div className="mt-4 space-y-3.5">{children}</div>
    </section>
  )
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows,
  className = '',
  ...rest
}) {
  const inputClass =
    'w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 font-sans text-xs text-stone-100 placeholder:text-stone-600 transition-colors focus:border-terracotta/60 focus:outline-none focus:ring-1 focus:ring-terracotta/30'

  return (
    <label className={`block ${className}`}>
      <span className="editorial-label text-[9px] text-stone-500">{label}</span>
      <div className="mt-1.5">
        {rows ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`${inputClass} resize-y leading-relaxed`}
            {...rest}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={inputClass}
            {...rest}
          />
        )}
      </div>
      {hint && (
        <span className="mt-1 block font-sans text-[10px] font-light leading-relaxed text-stone-600">
          {hint}
        </span>
      )}
    </label>
  )
}

export function SegmentedField({ label, options, value, onChange }) {
  return (
    <div>
      <span className="editorial-label text-[9px] text-stone-500">{label}</span>
      <div className="mt-1.5 flex gap-1 rounded-lg border border-stone-800 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-md px-2.5 py-1.5 font-sans text-[11px] transition-colors ${
              value === option.value
                ? 'bg-terracotta font-semibold text-stone-50'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ToggleField({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2.5">
      <div className="min-w-0">
        <div className="font-sans text-xs text-stone-100">{label}</div>
        {description && (
          <div className="mt-0.5 font-sans text-[10px] font-light leading-relaxed text-stone-500">
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-terracotta' : 'bg-stone-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-stone-50 transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function ImagePicker({ label, hint, value, onChange, images = realImages }) {
  const { lang } = useLanguage()

  return (
    <div>
      <span className="editorial-label text-[9px] text-stone-500">{label}</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((image) => {
          const selected = image.src === value
          return (
            <button
              key={image.src}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(image.src)}
              className={`group overflow-hidden rounded-lg border text-left transition-colors ${
                selected
                  ? 'border-terracotta ring-1 ring-terracotta/40'
                  : 'border-stone-800 hover:border-stone-600'
              }`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-stone-900">
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {selected && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-stone-50">
                    ✓
                  </span>
                )}
              </span>
              <span
                className={`block px-2 py-1.5 font-sans text-[9px] leading-snug ${
                  selected ? 'text-stone-100' : 'text-stone-500'
                }`}
              >
                {lang === 'en' ? image.labelEn : image.label}
              </span>
            </button>
          )
        })}
      </div>
      {hint && (
        <span className="mt-2 block font-sans text-[10px] font-light leading-relaxed text-stone-600">
          {hint}
        </span>
      )}
    </div>
  )
}
