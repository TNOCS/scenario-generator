import { CollectionNames, CollectionNamesPlus, IAppModel, UpdateStream } from "../meiosis";
import { IContent } from "../../models";
import { localStorageFactory } from '../localstorage-service';

export type CollectionItemMode = "view" | "edit" | "loading";

export type CollectionType<T extends IContent> = {
  section?: string;
  current?: Partial<T>;
  list?: Partial<T>[];
};

export type CollectionsModel<T extends IContent> = Record<CollectionNames, CollectionType<T>>;

/** Actions that can be invoked on each collection */
export type CollectionActions<T extends IContent> = {
  /** Get a list of all the active (?) items */
  updateList: () => void;
  /** Select an item */
  load: (id: string) => void;
  /** Save an item */
  save: (item: Partial<T>, callback?: (list: Partial<T>[]) => void) => void; // | T;
  /** Delete an item */
  del: (id: string) => void;
  /** Change section */
  changeSection: (sectionId: string) => void;
};

/** All actions that can be invoked per collection */
export type CollectionsActions<T extends IContent> = Record<CollectionNamesPlus, CollectionActions<T>>;

export interface ICollectionState<T extends IContent> {
  initial: CollectionsModel<T>;
  actions: (us: UpdateStream, states: flyd.Stream<IAppModel>) => CollectionsActions<T>;
}

export const collectionFactory = <T extends IContent>(collectionName: CollectionNamesPlus) => {
  const lsSvc = localStorageFactory<T>(collectionName);

  return {
    initial: {
      [collectionName]: {
        mode: undefined,
        current: undefined,
        list: [] as T[],
      } as CollectionType<T>,
    } as CollectionsModel<T>,
    actions: (us, states) => {
      return {
        [collectionName]: {
          updateList: async () => {
            const list = await lsSvc.loadList();
            if (list) {
              us({ [collectionName]: { list } });
            }
          },
          load: async (id) => {
            const current = await lsSvc.load(id);
            if (current) {
              const state = states();
              const { current: old = {} } = state[collectionName];
              Object.keys(old).forEach((k) => (old[k as keyof IContent] = undefined));
              us({ [collectionName]: { current: { ...old, ...current } } });
            }
          },
          save: async (item, callback?: (list: Partial<T>[]) => void) => {
            const list = await lsSvc.save(item);
            if (list) {
              console.table(list);
              us({ [collectionName]: { list } });
              callback && callback(list);
            }
          },
          del: async (id) => {
            const list = await lsSvc.del(id);
            if (list) {
              us({ [collectionName]: { list } });
            }
          },
          changeSection: (section: string) => us({ [collectionName]: { section } }),
        } as CollectionActions<T>,
      } as CollectionsActions<T>;
    },
  } as ICollectionState<T>;
};
