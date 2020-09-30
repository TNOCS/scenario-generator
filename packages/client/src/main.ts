import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css';
import App from "./App.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import router from "./router";
import store from "./store";
import './assets/v2018.css';

Vue.config.productionTip = false;
Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: false,
    themes: {
      light: { accent: "#FF9800" },
      dark: { accent: "#FF9800" }
    }
  }
});

export default new Vue({
  vuetify: vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
