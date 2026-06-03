const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (import.meta.env.VITE_API_BASE) {
    const base = import.meta.env.VITE_API_BASE.replace(/\/$/, '')
    return `${base}/api/v1`
  }
  return 'http://localhost:8004/api/v1'
}

export const API_URL = getApiUrl()
export const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY || 'jibd7mc5pv0mllkmefqf'
export const REVERB_HOST = import.meta.env.VITE_REVERB_HOST || 'localhost'
export const REVERB_PORT = import.meta.env.VITE_REVERB_PORT || '8080'
