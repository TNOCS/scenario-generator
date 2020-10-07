import { merge } from "../utils/mergerino";
import { scan, stream } from "flyd";
import { collectionFactory, CollectionsActions, CollectionsModel, CollectionType } from "./states/collection-state";
import { appStateMgmt, IAppStateActions, IAppStateModel } from "./states/app-state";
import { IContent, IScenario } from "../models";

export interface IActions extends IAppStateActions, CollectionsActions<IContent> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = flyd.Stream<Partial<ModelUpdateFunction>>;

export type CollectionNames = "scenarios"| "actors" | "locations" | "motivations" | "weapons";
export const CollectionNamesArr: Array<CollectionNames> = ["scenarios", "actors", "locations", "motivations", "weapons"];
export const TranslateKeys = { scenarios: "SCENARIO", actors: "ACTOR", locations: "LOCATION", motivations: "MOTIVATION", weapons: "WEAPON" };

const scenariosCollection = collectionFactory<IScenario>("scenarios");
const actorsCollection = collectionFactory<IContent>("actors");
const locationsCollection = collectionFactory<IContent>("locations");
const motivationsCollection = collectionFactory<IContent>("motivations");
const weaponsCollection = collectionFactory<IContent>("weapons");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  scenarios: CollectionType<IScenario>;
  actors: CollectionType<IContent>;
  locations: CollectionType<IContent>;
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
    scenariosCollection.initial,
    actorsCollection.initial,
    locationsCollection.initial,
    motivationsCollection.initial,
    weaponsCollection.initial
  ) as IAppModel,
  actions: (update: UpdateStream, states: flyd.Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      scenariosCollection.actions(update, states),
      actorsCollection.actions(update, states),
      locationsCollection.actions(update, states),
      motivationsCollection.actions(update, states),
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
