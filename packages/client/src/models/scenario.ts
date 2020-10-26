import { CollectionNames } from "../services/meiosis";
import { IContent } from ".";
import { ContentCategory } from "./content";

export type InconsistencyType = "partly" | "totally";

export interface Inconsistency {
  ids: string[];
  type: InconsistencyType;
}

export interface INarrative {
  name: string;
  components: { [key in CollectionNames]: string };
  narrative: string;
}

export interface IScenario extends IContent {
  categories: { [key in ContentCategory]: Array<CollectionNames> };
  inconsistencies: Inconsistency[];
  narratives: INarrative[];
}
