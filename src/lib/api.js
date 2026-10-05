const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const TOKEN_STORAGE_KEY = 'tixora_token'

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
  else localStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function request(path, options = {}) {
  const token = getToken()

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request gagal (status ${res.status})`)
  }

  return json.data
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  getCategories: () => request('/categories'),
  getEvents: (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    )
    const qs = new URLSearchParams(cleaned).toString()
    return request(`/events${qs ? `?${qs}` : ''}`)
  },
  getNearbyEvents: () => request('/events/nearby'),
  getEventLocations: () => request('/events/locations'),
  getTrendingEvents: () => request('/events/trending'),
  getEndedEvents: () => request('/events/ended'),
  getEventStats: () => request('/events/stats'),
}