import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import "@dzangolab/vue-country-flag-icon/dist/CountryFlag.css";
import CountryFlag from "@dzangolab/vue-country-flag-icon";
import App from "./App.vue";
import Vue from "vue";
import Vuetify from "vuetify";
import colors from "vuetify/lib/util/colors";
import router from "./router";
import { CollectionNames, store } from "./services/meiosis";
import { i18n, translateCollName } from "./i18n";
import "./assets/v2018.css";
import { isVowelSound } from "./utils/constants";
import VueLayers from "vuelayers";
import "vuelayers/lib/style.css"; // needs css-loader
import OverpassService from "./services/overpass-service";

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$overpass = new OverpassService();

Vue.use(Vuetify);
Vue.use(VueLayers, {
  dataProjection: "EPSG:4326",
});
Vue.use(CountryFlag);

Vue.filter("uppercase", (value: string) => {
  if (!value) return "";
  value = value.toString();
  return value.toUpperCase();
});
Vue.filter("capitalize", (value: string) => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
Vue.filter("trim", (value: string) => {
  if (!value) return "";
  return value.trim();
});
Vue.filter("translateCollectionName", (value: string) => {
  if (!value) return "";
  return translateCollName(value as CollectionNames);
});

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: false,
    themes: {
      light: { accent: "#5FB0C7", secondary: "#ddeced" },
      dark: { accent: "#3f798a", secondary: "#223132" },
    },
  },
});

export default new Vue({
  vuetify: vuetify,
  router,
  i18n,
  render: h => h(App),
}).$mount("#app");
