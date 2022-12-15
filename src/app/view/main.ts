import "../../styles/markdown.css"
import { createApp } from "vue"
import App from "./App.vue"
import "../../store"

import '@unocss/reset/tailwind.css'
import "../../styles/main.css"
import "uno.css"

const params = new URLSearchParams(import.meta.url.split('?')[1])
console.log(import.meta.url, params, params.get('role'))
const app = createApp(App, {params})
app.mount("#app")
