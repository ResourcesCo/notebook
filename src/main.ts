import { createApp } from "vue"
import { createHead } from "@vueuse/head"
import App from "./App.vue"
import "./store"

import '@unocss/reset/tailwind.css'
import "./styles/main.css"
import "uno.css"

import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
app.use(createHead())
app.mount("#app")

registerSW()