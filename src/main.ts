import { createApp } from "vue"
import { createHead } from "@vueuse/head"
import App from "./App.vue"
import "./store"

import '@unocss/reset/tailwind.css'
import "./styles/main.css"
import "uno.css"

const app = createApp(App)
app.use(createHead())
app.mount("#app")
