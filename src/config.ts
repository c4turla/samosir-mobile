const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.VITE_API_BASE) {
    const base = import.meta.env.VITE_API_BASE.replace(/\/$/, '')
    return `${base}/api/v1`
  }
  return 'https://demo-samosir.kendariweb.web.id/api/v1'
}

// The root URL without /api/v1, used for broadcasting auth
const getAppBaseUrl = (): string => {
  if (import.meta.env.VITE_APP_BASE_URL) {
    return import.meta.env.VITE_APP_BASE_URL.replace(/\/$/, '')
  }
  // Derive from API URL by stripping the /api/v1 suffix
  return getApiUrl().replace(/\/api\/v1\/?$/, '')
}

export const API_URL = getApiUrl()
export const APP_BASE_URL = getAppBaseUrl()
export const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY || 'jibd7mc5pv0mllkmefqf'
export const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || 'demo-samosir.kendariweb.web.id'
export const REVERB_PORT = import.meta.env.VITE_REVERB_PORT || '443'
export const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || 'https'
