import "virtual:windi.css";
import "../../styles/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import "../../modules/store";

const app = createApp(App);
app.mount("#app");
