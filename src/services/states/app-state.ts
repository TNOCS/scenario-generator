import { kanbanDirectionStorageKey, themeStorageKey } from '../../utils/constants';
import { i18n, languageStorageKey } from '../../i18n';
import { CollectionNames, CollectionNamesArr, IAppModel, UpdateStream } from '../meiosis';
import { INarrative, Inconsistency } from '../../models';
import { pickBy } from 'lodash';

const log = console.log;

export interface IAppStateModel {
  app: {
    apiService: string;
    route: string;
    language: string;
    theme: string;
    note: string;
    narrative: INarrative;
    drawer: boolean;
    kanbanDirVert: boolean;
    //   page?: Dashboards;
  };
}

export interface IAppStateActions {
  search: (isSearching: boolean, searchQuery?: string) => void;
  changePage: (route: string) => void;
  changeLanguage: (language: string) => void;
  changeTheme: (theme: string) => void;
  importState: (state: string) => void;
  exportState: () => string;
  changeNarrative: (narrative: INarrative) => void;
  updateInconsistencies: (inconsistencies: Inconsistency[]) => void;
  notify: (note: string) => void;
  toggleDrawer: (drawer: boolean) => void;
  setDirection: (directionVertical: boolean) => void;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream, states: flyd.Stream<IAppModel>) => IAppStateActions;
}

export const appStateMgmt = {
  initial: {
    app: {
      /** During development, use this URL to access the server. */
      apiService: process.env.SERVER || window.location.origin,
      route: '/',
      language: localStorage.getItem(languageStorageKey) || 'gb',
      kanbanDirVert: localStorage.getItem(kanbanDirectionStorageKey) === 'true' || false,
      theme: localStorage.getItem(themeStorageKey) || 'light',
      note: '',
      narrative: {} as INarrative,
      drawer: false,
    },
  },
  actions: (update, _states) => {
    return {
      search: (isSearching: boolean, searchQuery?: string) => update({ app: { isSearching, searchQuery } }),
      changePage: (route: string) => {
        log('Set route ' + route);
        update({ app: { route } });
      },
      changeLanguage: (language: string) => {
        log('Set language ' + language);
        i18n.locale = language;
        localStorage.setItem(languageStorageKey, language);
        update({ app: { language } });
      },
      changeTheme: (theme: string) => {
        log('Set theme ' + theme);
        localStorage.setItem(themeStorageKey, theme);
        update({ app: { theme } });
      },
      importState: (state: string) => {
        log('Import state');
        const newState = JSON.parse(state);
        if (newState && newState.scenarios && newState.scenarios.current && newState.scenarios.current.categories) {
          update({ ...newState, scenarios: { current: { categories: () => newState.scenarios.current.categories } } });
        }
        update(newState);
      },
      exportState: () => {
        log('Export state');
        return JSON.stringify(
          _states.map(s =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pickBy(s, (_, key: any) => {
              return key != 'app';
            })
          )
        );
      },
      changeNarrative: (narrative: INarrative) => {
        log('Set narrative ' + narrative.id);
        narrative.components = Object.assign(
          CollectionNamesArr.reduce((prev, cur) => ((prev[cur] = undefined), prev), {} as { [key in CollectionNames]: any }),
          narrative.components
        );
        update({ app: { narrative: () => narrative } });
      },
      updateInconsistencies: (inconsistencies: Inconsistency[]) => {
        log('Set inconsistencies');
        update({ scenarios: { current: { inconsistencies: inconsistencies } } });
      },
      notify: (note: string) => {
        log('Set notification');
        update({ app: { note } });
      },
      toggleDrawer: (drawer: boolean) => {
        log(`ToggleDrawer: ${drawer}`);
        update({ app: { drawer } });
      },
      setDirection: (directionVertical: boolean) => {
        localStorage.setItem(kanbanDirectionStorageKey, directionVertical.toString());
        update({ app: { kanbanDirVert: directionVertical } });
      },
    };
  },
} as IAppState;
