export type language = "en" | "nl";

export type I18NString = {
  [key in language]: string;
};
