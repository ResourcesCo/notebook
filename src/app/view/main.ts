import "virtual:windi.css";
import "../../styles/main.css";
import "../../styles/markdown.css"
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
const ctx = { app };
Object.values(import.meta.globEager("../../modules/*.ts")).map((i) =>
  i.install?.(ctx)
);
app.mount("#app");
