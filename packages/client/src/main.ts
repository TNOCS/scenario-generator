import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import router from "./router";
import { store } from "./services/meiosis";
import { i18n } from './i18n'
import "./assets/v2018.css";

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: false,
    themes: {
      light: { accent: "#FF9800" },
      dark: { accent: "#FF9800" },
    },
  },
});

export default new Vue({
  vuetify: vuetify,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
