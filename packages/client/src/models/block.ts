import { CollectionNames } from "../services/meiosis";
import { IContent } from "./content";

export interface IBlock extends IContent {
  indefinite?: boolean;
  prefix: string;
  suffix: string;
  blocktype: CollectionNames;
}
