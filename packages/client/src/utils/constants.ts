import { v4 as uuidv4 } from "uuid";

export const version = "1.0.0";
export const themeStorageKey = "V2018_THEME";

export const getUuid = (full: boolean = false) => full ? uuidv4() : uuidv4().substr(0, 8);
