// Key for saving config in localStorage
const STORAGE_KEY = 'samosir_app_config'

// Default fallback configuration
const defaultConfig = {
  api_url: import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/api/v1` : 'https://kendariweb-samosir-uat.q00ohl.easypanel.host/api/v1'),
  app_base_url: import.meta.env.VITE_APP_BASE_URL || 'https://kendariweb-samosir-uat.q00ohl.easypanel.host',
  reverb_app_key: import.meta.env.VITE_REVERB_APP_KEY || 'jibd7mc5pv0mllkmefqf',
  reverb_host: import.meta.env.VITE_REVERB_HOST || 'kendariweb-samosir-uat.q00ohl.easypanel.host',
  reverb_port: import.meta.env.VITE_REVERB_PORT || '443',
  reverb_scheme: import.meta.env.VITE_REVERB_SCHEME || 'https'
}

// Master URL where app-config.json is hosted (can be overridden by VITE_REMOTE_CONFIG_URL)
const REMOTE_CONFIG_URL = import.meta.env.VITE_REMOTE_CONFIG_URL || 'https://kendariweb.com/app-config.json'


// Read cached config from localStorage synchronously on module load
const getSavedConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...defaultConfig, ...parsed }
    }
  } catch (e) {
    console.warn('Failed to parse cached app config:', e)
  }
  return defaultConfig
}

let activeConfig = getSavedConfig()

// Exported live variables
export let API_URL = activeConfig.api_url
export let APP_BASE_URL = activeConfig.app_base_url
export let REVERB_APP_KEY = activeConfig.reverb_app_key
export let REVERB_HOST = activeConfig.reverb_host
export let REVERB_PORT = activeConfig.reverb_port
export let REVERB_SCHEME = activeConfig.reverb_scheme

// Helper getters for dynamic access
export const getApiUrl = () => activeConfig.api_url
export const getAppBaseUrl = () => activeConfig.app_base_url

/**
 * Fetch remote configuration from server and update local storage / state
 */
export const initRemoteConfig = async (): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(`${REMOTE_CONFIG_URL}?_t=${Date.now()}`, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' }
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const remoteData = await response.json()
      if (remoteData && typeof remoteData === 'object') {
        activeConfig = {
          api_url: remoteData.api_url || activeConfig.api_url,
          app_base_url: remoteData.app_base_url || activeConfig.app_base_url,
          reverb_app_key: remoteData.reverb_app_key || activeConfig.reverb_app_key,
          reverb_host: remoteData.reverb_host || activeConfig.reverb_host,
          reverb_port: String(remoteData.reverb_port || activeConfig.reverb_port),
          reverb_scheme: remoteData.reverb_scheme || activeConfig.reverb_scheme
        }

        // Update exported live bindings
        API_URL = activeConfig.api_url
        APP_BASE_URL = activeConfig.app_base_url
        REVERB_APP_KEY = activeConfig.reverb_app_key
        REVERB_HOST = activeConfig.reverb_host
        REVERB_PORT = activeConfig.reverb_port
        REVERB_SCHEME = activeConfig.reverb_scheme

        // Save updated config to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeConfig))
        console.log('[RemoteConfig] Updated configuration:', activeConfig)
        return true
      }
    }
  } catch (err) {
    console.warn('[RemoteConfig] Fetch skipped/failed, using cached or fallback config:', err)
  }
  return false
}

