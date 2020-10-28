import { CollectionNamesPlus } from "../services/meiosis";
export interface IBasicContent {
  id: string;
  name: string;
  type: CollectionNamesPlus;
}

export type ContentCategory = "THREAT" | "CONTEXT" | "SCENARIO";
export const ContextTypes = ["NONE", "LOCATION", "LOCATIONTYPE"] as const;
export type ContextType = typeof ContextTypes[number];
export const LocationTypes = ["NAME", "COORDINATES"] as const;
export type LocationType = typeof LocationTypes[number];
export type LocationContext = { [key in LocationType]: string };
export const LocationTypeTypes = ["LIST", "CUSTOM"] as const;
export type LocationTypeType = typeof LocationTypeTypes[number];
export type LocationTypeContext = { [key in LocationTypeType]: string };

export interface IContext {
  type: ContextType;
  data: LocationContext | Record<string, any>;
}

export interface IContent extends IBasicContent {
  category: ContentCategory;
  context?: IContext;
}
