/* eslint-disable no-prototype-builtins */
import { IContent, IScenario } from '../models';
import demo from '../assets/demo.json';
import { getUuid } from '../utils/constants';
import { CollectionNames, CollectionNamesPlus } from './meiosis';

interface IDemoScenarios {
  scenarios: IScenario[];
}
type IDemoRest = {
  [key in CollectionNames]: string[];
};
type IDemo = IDemoScenarios & IDemoRest;
type Error = { message: string };

const isError = (err: unknown): err is Error => {
  return (err as Error).message !== undefined;
};

const log = console.log;
const error = console.error;
const demoFile = demo as unknown as IDemo;

const createLocalStorageFactory = () => {
  return <T extends IContent>(listKey: CollectionNamesPlus) => {
    log(`Start LocalStorageFactory ${listKey}...`);

    if (!localStorage.getItem(listKey) && demoFile.hasOwnProperty(listKey)) {
      log(`Loading example keys for ${listKey}...`);
      const items: IContent[] = (demoFile[listKey] as (string | IScenario)[]).map((nameOrObj: string | IScenario) => {
        if (listKey === 'scenarios') {
          return Object.assign({ inconsistencies: [], narratives: [] }, nameOrObj) as IScenario;
        } else {
          return { id: getUuid(), name: nameOrObj, type: listKey } as IContent;
        }
      });
      localStorage.setItem(listKey, JSON.stringify(items));
    }

    const create = async (item: Partial<T>) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
        list.push(item as T);
        // list = list.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem(listKey, JSON.stringify(list));
        return list;
      } catch (err) {
        return isError(err) && error(err.message);
      }
    };

    const update = async (item: Partial<T>) => {
      try {
        console.log('Updating item');
        const list = JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
        const listItemIdx = list.findIndex(i => i.id === item.id);
        if (listItemIdx >= 0) {
          // Update existing item
          list.splice(listItemIdx, 1, { ...list[listItemIdx], ...item });
          localStorage.setItem(listKey, JSON.stringify(list));
          return list;
        } else {
          return create(item); // CHECK!!
        }
      } catch (err) {
        return isError(err) && error(err.message);
      }
    };

    const save = async (item: Partial<T>) => (item.id ? update(item) : create(item));

    const del = async (id: string) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
        const listItemIdx = list.findIndex(i => i.id === id);
        if (listItemIdx < 0) {
          return error(`Item not deleted: ${id}`);
        }
        // Delete existing item
        const listItem = list.splice(listItemIdx, 1).pop() || { id: 0 };
        localStorage.setItem(listKey, JSON.stringify(list));
        log(`Deleted ${listItem.id}`);
        return list;
      } catch (err) {
        return isError(err) && error(err.message);
      }
    };

    const delNarrative = (scenarioId: string, narrativeId: string) => {
      try {
        const list = JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
        const listItemIdx = list.findIndex(i => i.id === scenarioId);
        if (listItemIdx < 0) {
          return error(`Scenario not found: ${scenarioId}`);
        }
        // Delete existing item
        const listItem = list[listItemIdx] as unknown as IScenario;
        const narratives = listItem.narratives.filter(i => i.id !== narrativeId);
        listItem.narratives = narratives;
        localStorage.setItem(listKey, JSON.stringify(list));
        // log(`Deleted ${narrativeId}`);
        return list;
      } catch (err) {
        return isError(err) && error(err.message);
      }
    };

    const load = (id: string) => {
      const list = JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
      const listItem = list.find(i => i.id === id);
      return listItem;
    };

    const loadList = async () => {
      return JSON.parse(localStorage.getItem(listKey) || '[]') as T[];
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
      delNarrative,
      load,
      loadList,
      saveList,
      resetList,
    };
  };
};

export const localStorageFactory = createLocalStorageFactory();
// <T extends IContent>(key: string) => console.log(`Not implemented for ${key}`);
