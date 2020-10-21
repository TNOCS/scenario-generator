import { CollectionNamesPlus } from "../services/meiosis";
export interface IBasicContent {
  id: string;
  name: string;
  type: CollectionNamesPlus;
}

export type ContentCategory = "THREAT" | "CONTEXT" | "SCENARIO";
export const ContextTypes = ["NONE", "LOCATION", "LOCATIONTYPE"] as const;
export type ContextType = typeof ContextTypes[number];

export interface IContext {
  type: ContextType;
  data: Record<string, any>;
}

export interface IContent extends IBasicContent {
  category: ContentCategory;
  context?: IContext;
}
