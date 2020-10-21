import { CollectionNamesPlus } from "../services/meiosis";
export interface IBasicContent {
  id: string;
  name: string;
  type: CollectionNamesPlus;
}

export type ContentCategory = "THREAT" | "CONTEXT" | "SCENARIO";

export interface IContext {
  type: string;
  data: Record<string, any>;
}

export interface IContent extends IBasicContent {
  category: ContentCategory;
  context?: IContext;
}
