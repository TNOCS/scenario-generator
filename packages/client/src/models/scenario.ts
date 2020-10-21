import { CollectionNames } from "@/services/meiosis";
import { IContent } from ".";
import { ContentCategory } from "./content";

export interface IScenario extends IContent {
  categories: { [key in ContentCategory]: Array<CollectionNames> };
}
