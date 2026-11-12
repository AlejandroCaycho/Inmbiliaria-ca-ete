import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'impulso-auth'

export const DEMO_CREDENTIALS = {
  email: 'asesor@impulsoinmobiliario.pe',
  password: 'impulso2026',
  name: 'Asesor Impulso',
}

const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    return session?.email && session?.name ? session : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const login = useCallback(
    (email, password) =>
      new Promise((resolve, reject) => {
        window.setTimeout(() => {
          const matches =
            email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
            password === DEMO_CREDENTIALS.password

          if (!matches) {
            reject(new Error('invalid_credentials'))
            return
          }

          const session = {
            email: DEMO_CREDENTIALS.email,
            name: DEMO_CREDENTIALS.name,
            loginAt: new Date().toISOString(),
          }
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
          } catch {
            // Session still works in memory when storage is unavailable.
          }
          setUser(session)
          resolve(session)
        }, 700)
      }),
    [],
  )

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear when storage is unavailable.
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
