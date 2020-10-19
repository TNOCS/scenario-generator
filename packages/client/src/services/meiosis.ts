import { merge } from "../utils/mergerino";
import { scan, stream } from "flyd";
import { collectionFactory, CollectionsActions, CollectionsModel, CollectionType } from "./states/collection-state";
import { appStateMgmt, IAppStateActions, IAppStateModel } from "./states/app-state";
import { IBlock, IContent, IScenario } from "../models";

export interface IActions extends IAppStateActions, CollectionsActions<IContent | IScenario> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = flyd.Stream<Partial<ModelUpdateFunction>>;

export type CollectionNames =
  | "blocks"
  | "scenarios"
  | "actors"
  | "locations"
  | "motivations"
  | "modusoperandi"
  | "objects"
  | "weapons"
  | "weatherconditions"
  | "responsibilities";
export const CollectionNamesArr: Array<CollectionNames> = [
  "blocks",
  "scenarios",
  "actors",
  "locations",
  "motivations",
  "modusoperandi",
  "objects",
  "weapons",
  "weatherconditions",
  "responsibilities",
];
export const TranslateKeys = {
  blocks: "BLOCK",
  scenarios: "SCENARIO",
  actors: "ACTOR",
  locations: "LOCATION",
  motivations: "MOTIVATION",
  modusoperandi: "MODUS_OPERANDUS",
  weapons: "WEAPON",
  objects: "OBJECT",
  responsibilities: "RESPONSIBILITY",
  weatherconditions: "WEATHER_CONDITION",
};

const blocksCollection = collectionFactory<IBlock>("blocks");
const scenariosCollection = collectionFactory<IScenario>("scenarios");
const actorsCollection = collectionFactory<IContent>("actors");
const locationsCollection = collectionFactory<IContent>("locations");
const objectsCollection = collectionFactory<IContent>("objects");
const motivationsCollection = collectionFactory<IContent>("motivations");
const weaponsCollection = collectionFactory<IContent>("weapons");
const responsibilitiesCollection = collectionFactory<IContent>("responsibilities");
const weatherconditionsCollection = collectionFactory<IContent>("weatherconditions");
const modusoperandiCollection = collectionFactory<IContent>("modusoperandi");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  blocks: CollectionType<IScenario>;
  scenarios: CollectionType<IScenario>;
  actors: CollectionType<IContent>;
  locations: CollectionType<IContent>;
  objects: CollectionType<IContent>;
  motivations: CollectionType<IContent>;
  weapons: CollectionType<IContent>;
  responsibilities: CollectionType<IContent>;
  weatherconditions: CollectionType<IContent>;
  modusoperandi: CollectionType<IContent>;
}

// export type MeiosisComponent = FactoryComponent<{
//   state: IAppModel;
//   actions: IActions;
// }>;
const app = {
  initial: Object.assign(
    {},
    appStateMgmt.initial,
    blocksCollection.initial,
    scenariosCollection.initial,
    actorsCollection.initial,
    locationsCollection.initial,
    motivationsCollection.initial,
    objectsCollection.initial,
    weaponsCollection.initial,
    responsibilitiesCollection.initial,
    weatherconditionsCollection.initial,
    modusoperandiCollection.initial
  ) as IAppModel,
  actions: (update: UpdateStream, states: flyd.Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      blocksCollection.actions(update, states),
      scenariosCollection.actions(update, states),
      actorsCollection.actions(update, states),
      locationsCollection.actions(update, states),
      motivationsCollection.actions(update, states),
      objectsCollection.actions(update, states),
      weaponsCollection.actions(update, states),
      responsibilitiesCollection.actions(update, states),
      weatherconditionsCollection.actions(update, states),
      modusoperandiCollection.actions(update, states)
    ) as IActions,
};

const update = stream<ModelUpdateFunction>();
const states = scan(merge, app.initial, update);
const actions = app.actions(update, states);
export const store = {
  actions,
  states,
};
