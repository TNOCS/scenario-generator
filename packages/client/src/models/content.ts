import { I18NString } from ".";

export interface IBasicContent {
  id: string;
  name: I18NString;
  type: string;
}

export interface IContent extends IBasicContent {}
