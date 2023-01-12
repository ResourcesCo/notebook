import "../../styles/markdown.css"
import { createApp } from "vue"
import App from "./App.vue"
import "../../store"

import '@unocss/reset/tailwind.css'
import "../../styles/main.css"
import "uno.css"

// @ts-ignore
const params = new URLSearchParams(window.parentLocationSearch)
// @ts-ignore
delete window.parentLocationSearch
const app = createApp(App, {params})
app.mount("#app")
