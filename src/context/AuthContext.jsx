import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Saat pertama kali load app: kalau ada token tersimpan, coba ambil profil user
  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setIsLoading(false)
        return
      }
      try {
        const profile = await api.me()
        setUser(profile)
      } catch {
        setToken(null) // token basi/invalid, buang saja
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  async function login(email, password) {
    const data = await api.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(nama, email, password) {
    const data = await api.register({ nama, email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}  