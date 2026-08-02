import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initRemoteConfig } from './config'

// Await remote config initialization before mounting the application
initRemoteConfig().finally(() => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
})


