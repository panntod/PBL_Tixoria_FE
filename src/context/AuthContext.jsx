import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../lib/api'
import { USE_MOCK } from '../lib/services'
import { DEMO_USER } from '../lib/mock'

const AuthContext = createContext(null)
const MOCK_USER_KEY = 'tixora_mock_user'

function readMockUser() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USER_KEY))
  } catch {
    return null
  }
}

function writeMockUser(user) {
  try {
    if (user) localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(MOCK_USER_KEY)
  } catch {
    /* abaikan */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Saat pertama kali load app: pulihkan sesi
  useEffect(() => {
    async function restoreSession() {
      if (USE_MOCK) {
        setUser(readMockUser())
        setIsLoading(false)
        return
      }
      if (!getToken()) {
        setIsLoading(false)
        return
      }
      try {
        setUser(await api.me())
      } catch {
        setToken(null) // token basi/invalid
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  async function login(email, password) {
    if (USE_MOCK) {
      // Mode demo: kata sandi < 8 karakter dianggap salah
      if (password.length < 8) throw new Error('Surel atau kata sandi salah. Coba lagi.')
      const next = { ...DEMO_USER, email }
      writeMockUser(next)
      setUser(next)
      return next
    }
    const data = await api.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(nama, email, password) {
    if (USE_MOCK) {
      const next = { ...DEMO_USER, nama, email, whatsapp: '', institusi: '' }
      writeMockUser(next)
      setUser(next)
      return next
    }
    const data = await api.register({ nama, email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function forgotPassword(email) {
    if (USE_MOCK) return true
    await api.forgotPassword({ email })
    return true
  }

  async function updateProfile(patch) {
    if (USE_MOCK) {
      const next = { ...user, ...patch }
      writeMockUser(next)
      setUser(next)
      return next
    }
    const next = await api.updateProfile(patch)
    setUser(next)
    return next
  }

  function logout() {
    setToken(null)
    writeMockUser(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, forgotPassword, updateProfile }}
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
