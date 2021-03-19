import "virtual:windi.css";
import "./styles/main.css";
import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import App from "./App.vue";

const app = createApp(App);
app.use(createHead())
const ctx = { app };
Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
  i.install?.(ctx)
);
app.mount("#app");
