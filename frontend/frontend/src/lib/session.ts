const DEFAULT_API = 'http://localhost:5000/api'

export function getApiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API).replace(/\/$/, '')
}

/** Build an API URL without doubling `/api`. */
export function apiUrl(path: string) {
  const base = getApiBase()
  const p = path.startsWith('/') ? path : `/${path}`
  if (base.endsWith('/api') && p.startsWith('/api/')) {
    return `${base}${p.slice(4)}`
  }
  if (!base.endsWith('/api') && !p.startsWith('/api')) {
    return `${base}/api${p}`
  }
  return `${base}${p}`
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token') || localStorage.getItem('accessToken')
}

export function persistSession(token: string, refreshToken?: string, orgId?: number | string | null) {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
  localStorage.setItem('accessToken', token)
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('refresh_token', refreshToken)
  }
  if (orgId != null) {
    localStorage.setItem('currentOrgId', String(orgId))
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('refresh_token')
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function startGoogleAuth() {
  window.location.href = apiUrl('/auth/google')
}
