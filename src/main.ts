import "virtual:windi.css"
import "./styles/main.css"
import { createApp } from "vue"
import { createHead } from "@vueuse/head"
import App from "./App.vue"
import "./store"

const app = createApp(App)
app.use(createHead())
app.mount("#app")
