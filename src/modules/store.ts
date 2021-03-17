import { createStore } from "vuex";
import { UserModule } from "~/types";

export const install: UserModule = ({ app }) => {
  const store = createStore({});

  app.use(store);
};
