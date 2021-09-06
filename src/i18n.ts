import Vue from "vue";
import VueI18n from "vue-i18n";
import CountryFlag from "@dzangolab/vue-country-flag-icon";
import nl from "./assets/translations/nl.json";
import gb from "./assets/translations/gb.json";
import { isVowelSound } from "./utils/constants";
import { CollectionNames } from "./services/meiosis";

// register i18n module
Vue.use(VueI18n);
Vue.use(CountryFlag);

const messages = Object.assign(nl, gb);
const languages = ["gb", "nl"];
const languageStorageKey = "V2018_LANGUAGE";

const i18n = new VueI18n({
  locale: localStorage.getItem(languageStorageKey) || "gb", // set locale
  fallbackLocale: "gb",
  messages, // set locale messages
  modifiers: {},
});

export const translateCollName = (key: CollectionNames): string => {
  return i18n.tc(`COMP.${key.toUpperCase()}`).toString();
};

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
