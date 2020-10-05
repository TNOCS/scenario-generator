import { IContent } from "../models";
import demo from "../assets/demo.json";
import { v4 as uuidv4 } from "uuid";
import { CollectionNames } from "./meiosis";

const log = console.log;
const error = console.error;

const createLocalStorageFactory = () => {
  return <T extends IContent>(listKey: string) => {
    log(`Start LocalStorageFactory ${listKey}...`);
    if (!localStorage.getItem(listKey)) {
      log(`Loading example keys for ${listKey}...`);
      const items: T[] = (demo[listKey as CollectionNames] as string[]).map((name) => {
        return { id: uuidv4(), name: name, type: listKey } as IContent;
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

    return {
      create,
      update,
      save,
      del,
      load,
      loadList,
    };
  };
};

export const localStorageFactory = createLocalStorageFactory();
// <T extends IContent>(key: string) => console.log(`Not implemented for ${key}`);
