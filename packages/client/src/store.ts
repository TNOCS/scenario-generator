import { IState } from './api/interfaces';

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store<IState>({
  state: {
    activeRoute: '',
  },
  mutations: {},
  actions: {
    setRoute({ state }, route: string) {
      state.activeRoute = route;
      return route;
    },

    goTo({ dispatch }, route: string) {
      return dispatch('setRoute', route);
    },

    async getRoute({ state }) {
      return state.activeRoute;
    }
  },

  modules: {}
});
