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
export const TranslateKeys = {
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

const blocksCollection = collectionFactory<IBlock>("blocks");
const capabilitiesCollection = collectionFactory<IBlock>("capabilities");
const equipmentCollection = collectionFactory<IBlock>("equipment");
const scenariosCollection = collectionFactory<IScenario>("scenarios");
const actorsCollection = collectionFactory<IContent>("actors");
const locationsCollection = collectionFactory<IContent>("locations");
const objectsCollection = collectionFactory<IContent>("objects");
const targettypesCollection = collectionFactory<IContent>("targettypes");
const motivationsCollection = collectionFactory<IContent>("motivations");
const weaponsCollection = collectionFactory<IContent>("weapons");
const responsibilitiesCollection = collectionFactory<IContent>("responsibilities");
const weatherconditionsCollection = collectionFactory<IContent>("weatherconditions");
const weatherbehaviourCollection = collectionFactory<IContent>("weatherbehaviour");
const modusoperandiCollection = collectionFactory<IContent>("modusoperandi");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  blocks: CollectionType<IScenario>;
  capabilities: CollectionType<IScenario>;
  equipment: CollectionType<IScenario>;
  scenarios: CollectionType<IScenario>;
  actors: CollectionType<IContent>;
  locations: CollectionType<IContent>;
  objects: CollectionType<IContent>;
  targettypes: CollectionType<IContent>;
  motivations: CollectionType<IContent>;
  weapons: CollectionType<IContent>;
  responsibilities: CollectionType<IContent>;
  weatherconditions: CollectionType<IContent>;
  weatherbehaviour: CollectionType<IContent>;
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
    capabilitiesCollection.initial,
    equipmentCollection.initial,
    scenariosCollection.initial,
    actorsCollection.initial,
    locationsCollection.initial,
    motivationsCollection.initial,
    objectsCollection.initial,
    targettypesCollection.initial,
    weaponsCollection.initial,
    responsibilitiesCollection.initial,
    weatherconditionsCollection.initial,
    weatherbehaviourCollection.initial,
    modusoperandiCollection.initial
  ) as IAppModel,
  actions: (update: UpdateStream, states: flyd.Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      blocksCollection.actions(update, states),
      capabilitiesCollection.actions(update, states),
      equipmentCollection.actions(update, states),
      scenariosCollection.actions(update, states),
      actorsCollection.actions(update, states),
      locationsCollection.actions(update, states),
      motivationsCollection.actions(update, states),
      objectsCollection.actions(update, states),
      targettypesCollection.actions(update, states),
      weaponsCollection.actions(update, states),
      responsibilitiesCollection.actions(update, states),
      weatherconditionsCollection.actions(update, states),
      weatherbehaviourCollection.actions(update, states),
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
