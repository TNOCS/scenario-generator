import { CollectionNames } from "../services/meiosis";
import { IContent } from "./content";

export interface IBlock extends IContent {
  prefix: string;
  suffix: string;
  blocktype: CollectionNames;
}
