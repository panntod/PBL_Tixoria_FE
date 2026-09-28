const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request gagal (status ${res.status})`)
  }

  return json.data
}

export const api = {
  getCategories: () => request('/categories'),
  getEvents: (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    )
    const qs = new URLSearchParams(cleaned).toString()
    return request(`/events${qs ? `?${qs}` : ''}`)
  },
  getNearbyEvents: () => request('/events/nearby'),
  getTrendingEvents: () => request('/events/trending'),
  getEndedEvents: () => request('/events/ended'),
  getEventStats: () => request('/events/stats'),
}
