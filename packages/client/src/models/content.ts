import { I18NString } from ".";

export interface IBasicContent {
  id: string;
  name: string;
  type: string;
}

export interface IContent extends IBasicContent {}
