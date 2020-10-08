import { merge } from "../utils/mergerino";
import { scan, stream } from "flyd";
import { collectionFactory, CollectionsActions, CollectionsModel, CollectionType } from "./states/collection-state";
import { appStateMgmt, IAppStateActions, IAppStateModel } from "./states/app-state";
import { IBlock, IContent, IScenario } from "../models";

export interface IActions extends IAppStateActions, CollectionsActions<IContent | IScenario> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = flyd.Stream<Partial<ModelUpdateFunction>>;

export type CollectionNames = "blocks"| "scenarios"| "actors" | "locations" | "motivations" | "objects" | "weapons";
export const CollectionNamesArr: Array<CollectionNames> = ["blocks", "scenarios", "actors", "locations", "motivations", "objects", "weapons"];
export const TranslateKeys = { blocks: "BLOCK", scenarios: "SCENARIO", actors: "ACTOR", locations: "LOCATION", motivations: "MOTIVATION", weapons: "WEAPON", objects: "OBJECT" };

const blocksCollection = collectionFactory<IBlock>("blocks");
const scenariosCollection = collectionFactory<IScenario>("scenarios");
const actorsCollection = collectionFactory<IContent>("actors");
const locationsCollection = collectionFactory<IContent>("locations");
const objectsCollection = collectionFactory<IContent>("objects");
const motivationsCollection = collectionFactory<IContent>("motivations");
const weaponsCollection = collectionFactory<IContent>("weapons");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  blocks: CollectionType<IScenario>;
  scenarios: CollectionType<IScenario>;
  actors: CollectionType<IContent>;
  locations: CollectionType<IContent>;
  objects: CollectionType<IContent>;
  motivations: CollectionType<IContent>;
  weapons: CollectionType<IContent>;
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
    weaponsCollection.initial
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
      weaponsCollection.actions(update, states)
    ) as IActions,
};

const update = stream<ModelUpdateFunction>();
const states = scan(merge, app.initial, update);
const actions = app.actions(update, states);
export const store = {
  actions,
  states,
};
