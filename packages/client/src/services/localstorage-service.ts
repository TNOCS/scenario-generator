import { IBlock, IContent, IScenario } from "../models";
import demo from "../assets/demo.json";
import { getUuid } from "../utils/constants";
import { CollectionNames, CollectionNamesPlus } from './meiosis';

interface IDemoScenarios {
  scenarios: IScenario[];
}
type IDemoRest = {
  [key in CollectionNames]: string[];
};
type IDemo = IDemoScenarios & IDemoRest;

const log = console.log;
const error = console.error;
const demoFile = demo as any as IDemo;

const createLocalStorageFactory = () => {
  return <T extends IContent>(listKey: CollectionNamesPlus) => {
    log(`Start LocalStorageFactory ${listKey}...`);

    if (!localStorage.getItem(listKey) && demoFile.hasOwnProperty(listKey)) {
      log(`Loading example keys for ${listKey}...`);
      const items: IContent[] = (demoFile[listKey] as (string | IScenario)[]).map((nameOrObj: string | IScenario) => {
        if (listKey === "scenarios") {
          return nameOrObj as IScenario;
        } else {
          return { id: getUuid(), name: nameOrObj, type: listKey } as IContent;
        }
      });
      localStorage.setItem(listKey, JSON.stringify(items));
    }

    const create = async (item: Partial<T>) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || "[]") as T[];
        list.push(item as T);
        localStorage.setItem(listKey, JSON.stringify(list));
        return list;
      } catch (err) {
        return error(err.message);
      }
    };

    const update = async (item: Partial<T>) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || "[]") as T[];
        const listItemIdx = list.findIndex((i) => i.id === item.id);
        if (listItemIdx >= 0) {
          // Update existing item
          const listItem = list.splice(listItemIdx, 1).pop()!;
          const newItem = Object.assign(listItem, item);
          list.push(newItem);
          localStorage.setItem(listKey, JSON.stringify(list));
          return list;
        } else {
          return create(item); // CHECK!!
        }
      } catch (err) {
        return error(err.message);
      }
    };

    const save = async (item: Partial<T>) => (item.id ? update(item) : create(item));

    const del = async (id: string) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || "[]") as T[];
        const listItemIdx = list.findIndex((i) => i.id === id);
        if (listItemIdx >= 0) {
          // Delete existing item
          const listItem = list.splice(listItemIdx, 1).pop()!;
          localStorage.setItem(listKey, JSON.stringify(list));
          log(`Deleted ${listItem.id}`);
          return list;
        } else {
          return error(`Item not deleted: ${id}`);
        }
      } catch (err) {
        return error(err.message);
      }
    };

    const load = (id: string) => {
      const list = JSON.parse(localStorage.getItem(listKey) || "[]") as T[];
      const listItem = list.find((i) => i.id === id);
      return listItem;
    };

    const loadList = async () => {
      return JSON.parse(localStorage.getItem(listKey) || "[]") as T[];
    };

    const saveList = async (list: Partial<T>[]) => {
      localStorage.setItem(listKey, JSON.stringify(list));
    };

    const resetList = async () => {
      const list = [] as T[];
      localStorage.setItem(listKey, JSON.stringify(list));
    };

    return {
      create,
      update,
      save,
      del,
      load,
      loadList,
      saveList,
      resetList,
    };
  };
};

export const localStorageFactory = createLocalStorageFactory();
// <T extends IContent>(key: string) => console.log(`Not implemented for ${key}`);
