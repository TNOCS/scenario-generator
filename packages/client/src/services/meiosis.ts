import { merge } from "../utils/mergerino";
import { scan, stream } from "flyd";
import {
  collectionFactory,
  CollectionsActions,
  CollectionsModel,
  CollectionType,
  ICollectionState,
} from "./states/collection-state";
import { appStateMgmt, IAppStateActions, IAppStateModel } from "./states/app-state";
import { IBlock, IContent, IScenario } from "../models";

export interface IActions extends IAppStateActions, CollectionsActions<IContent | IScenario> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = flyd.Stream<Partial<ModelUpdateFunction>>;

export type CollectionNames =
  | "blocks"
  | "capabilities"
  | "equipment"
  | "scenarios"
  | "actors"
  | "locations"
  | "motivations"
  | "modusoperandi"
  | "objects"
  | "targettypes"
  | "weapons"
  | "weatherconditions"
  | "weatherbehaviour"
  | "responsibilities";
export const CollectionNamesArr: Array<CollectionNames> = [
  "blocks",
  "capabilities",
  "equipment",
  "scenarios",
  "actors",
  "locations",
  "motivations",
  "modusoperandi",
  "objects",
  "targettypes",
  "weapons",
  "weatherconditions",
  "weatherbehaviour",
  "responsibilities",
];
export const TranslateKeys: { [key in CollectionNames]: string } = {
  blocks: "BLOCK",
  capabilities: "CAPABILITY",
  equipment: "EQUIPMENT",
  scenarios: "SCENARIO",
  actors: "ACTOR",
  locations: "LOCATION",
  motivations: "MOTIVATION",
  modusoperandi: "MODUS_OPERANDUS",
  weapons: "WEAPON",
  objects: "OBJECT",
  targettypes: "TARGET_TYPE",
  responsibilities: "RESPONSIBILITY",
  weatherconditions: "WEATHER_CONDITION",
  weatherbehaviour: "WEATHER_BEHAVIOUR",
};

export type ICollectionRecord = { [key in CollectionNames]: ICollectionState<IContent> };

export const AllCollections: ICollectionRecord = {} as ICollectionRecord;
CollectionNamesArr.forEach((name) => (AllCollections[name] = collectionFactory<IContent>(name)));

// const blocksCollection = collectionFactory<IBlock>("blocks");
// const scenariosCollection = collectionFactory<IScenario>("scenarios");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  // blocks: CollectionType<IScenario>;
  // scenarios: CollectionType<IScenario>;
}

const app = {
  initial: Object.assign(
    {},
    appStateMgmt.initial,
    // scenariosCollection.initial,
    // blocksCollection.initial,
    ...Object.values(AllCollections).map((coll) => coll.initial)
  ) as IAppModel,
  actions: (update: UpdateStream, states: flyd.Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      // scenariosCollection.actions(update, states),
      // blocksCollection.actions(update, states),
      ...Object.values(AllCollections).map((coll) => coll.actions(update, states))
    ) as IActions,
};

const update = stream<ModelUpdateFunction>();
const states = scan(merge, app.initial, update);
const actions = app.actions(update, states);
export const store = {
  actions,
  states,
};
