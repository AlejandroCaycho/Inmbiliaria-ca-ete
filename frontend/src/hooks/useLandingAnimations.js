import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export default function useLandingAnimations(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.hero-bg-image',
          { scale: 1.07 },
          { scale: 1, duration: 1.6, ease: 'power2.out' },
        )

        const introBlocks = ['meta', 'label', 'copy', 'filters'].map((name) =>
          scope.querySelector(`[data-hero="${name}"]`),
        )
        gsap.set(introBlocks, { autoAlpha: 0, y: 22 })

        const titleWords = gsap.utils.toArray('[data-hero="title-word"]', scope)
        gsap.set(titleWords, { autoAlpha: 0, y: 30 })

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        intro
          .to('[data-hero="meta"]', { autoAlpha: 1, y: 0, duration: 0.6 }, 0.1)
          .to('[data-hero="label"]', { autoAlpha: 1, y: 0, duration: 0.55 }, 0.2)
          .fromTo(
            '[data-hero="label-line"]',
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
            0.35,
          )
          .to(
            titleWords,
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out' },
            0.3,
          )
          .to('[data-hero="copy"]', { autoAlpha: 1, y: 0, duration: 0.7 }, 0.65)
          .to('[data-hero="filters"]', { autoAlpha: 1, y: 0, duration: 0.75 }, 0.8)

        const initializedReveals = new WeakSet()

        const initReveals = () => {
          const pending = gsap.utils
            .toArray('[data-reveal]', scope)
            .filter((element) => !initializedReveals.has(element))
          if (!pending.length) return

          pending.forEach((element) => initializedReveals.add(element))
          gsap.set(pending, { autoAlpha: 0, y: 30 })
          ScrollTrigger.batch(pending, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: 'power3.out',
                stagger: 0.08,
                overwrite: true,
              }),
          })
        }

        initReveals()

        const refresh = () => {
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.trigger && !trigger.trigger.isConnected) trigger.kill()
          })
          initReveals()
          ScrollTrigger.refresh()
        }

        let active = true
        const handleRefresh = () => refresh()

        window.addEventListener('load', handleRefresh)
        window.addEventListener('impulso:refresh-animations', handleRefresh)
        document.fonts?.ready
          ?.then(() => {
            if (active) refresh()
          })
          .catch(() => {})

        return () => {
          active = false
          window.removeEventListener('load', handleRefresh)
          window.removeEventListener('impulso:refresh-animations', handleRefresh)
        }
      }, scope)

      return () => ctx.revert()
    })

    media.add(
      '(min-width: 1280px) and (prefers-reduced-motion: no-preference)',
      () => {
        const line = scope.querySelector('[data-method-line]')
        if (!line) return

        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top 88%',
              end: 'bottom 62%',
              scrub: 0.6,
            },
          },
        )
      },
    )

    return () => media.revert()
  }, [scopeRef])
}
