import { createApp } from "vue"
import App from "./App.vue"
import "../store"

import '@unocss/reset/tailwind.css'
import "../styles/main.css"
import "uno.css"

// import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
app.mount("#app")

// registerSW()