import Vue from "vue";
import VueI18n from "vue-i18n";
import CountryFlag from "@dzangolab/vue-country-flag-icon";
import nl from "./assets/translations/nl.json";
import gb from "./assets/translations/gb.json";

// register i18n module
Vue.use(VueI18n);
Vue.use(CountryFlag);

const messages = Object.assign(nl, gb);
const languages = ["gb", "nl"];
const languageStorageKey = "MAVAST_LANGUAGE";

const i18n = new VueI18n({
  locale: localStorage.getItem(languageStorageKey) || "gb", // set locale
  fallbackLocale: "gb",
  messages, // set locale messages
});

const translate = (key: string): string => {
  if (!key) {
    return "";
  }
  return i18n.t(key).toString();
};

const tc = (key: string, nr?: number, values?: any): string => {
  if (!key) {
    return "";
  }
  return i18n.tc(key, nr, values).toString();
};

export { i18n, translate, languages, languageStorageKey }; //export above method
