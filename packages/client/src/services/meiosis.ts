import { merge } from "../utils/mergerino";
import { scan, stream } from "flyd";
import { collectionFactory, CollectionsActions, CollectionsModel, CollectionType, ICollectionState } from "./states/collection-state";
import { appStateMgmt, IAppStateActions, IAppStateModel } from "./states/app-state";
import { IContent, IScenario } from "../models";

export interface IActions extends IAppStateActions, CollectionsActions<IContent | IScenario> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = flyd.Stream<Partial<ModelUpdateFunction>>;

export type CollectionNames =
  | "ThreatDirection"
  | "Impact"
  | "Duration"
  | "Persons"
  | "Motivation"
  | "Capabilities"
  | "PhysicalAngleOfAttack"
  | "ModusOperandi"
  | "Equipment"
  | "TargetType"
  | "Responsibility"
  | "WeatherType"
  | "WeatherBehaviour"
  | "TypeOfEnvironment"
  | "PeopleDensity"
  | "Intent"
  | "ExistingInfra"
  | "PrivacyAwareness"
  | "SecurityAwareness"
  | "TypeOfObject"
  | "AvailableBudget"
  | "CompartmentsPresent"
  | "OpenCompartments"
  | "RelationOwnerObjectAndOwnerSecuritySystem";

export type CollectionNamesPlus = CollectionNames | 'scenarios';

export const CollectionNamesArr: Array<CollectionNames> = [
  "ThreatDirection",
  "Impact",
  "Duration",
  "Persons",
  "Motivation",
  "Capabilities",
  "PhysicalAngleOfAttack",
  "ModusOperandi",
  "Equipment",
  "TargetType",
  "Responsibility",
  "WeatherType",
  "WeatherBehaviour",
  "TypeOfEnvironment",
  "PeopleDensity",
  "Intent",
  "ExistingInfra",
  "PrivacyAwareness",
  "SecurityAwareness",
  "TypeOfObject",
  "AvailableBudget",
  "CompartmentsPresent",
  "OpenCompartments",
  "RelationOwnerObjectAndOwnerSecuritySystem",
];
export const CollectionNamesPlusArr: Array<CollectionNamesPlus> = [...CollectionNamesArr, 'scenarios'];

export type ICollectionRecord = { [key in CollectionNames]: ICollectionState<IContent> };

export const AllCollections: ICollectionRecord = {} as ICollectionRecord;
CollectionNamesArr.forEach((name) => (AllCollections[name] = collectionFactory<IContent>(name)));
const scenariosCollection = collectionFactory<IScenario>("scenarios");

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  scenarios: CollectionType<IScenario>;
}

const app = {
  initial: Object.assign(
    {},
    appStateMgmt.initial,
    scenariosCollection.initial,
    ...Object.values(AllCollections).map((coll) => coll.initial)
  ) as IAppModel,
  actions: (update: UpdateStream, states: flyd.Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      scenariosCollection.actions(update, states),
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
