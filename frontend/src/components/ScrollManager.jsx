import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    const target = document.getElementById(hash.slice(1))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [pathname, hash, key])

  return null
}
