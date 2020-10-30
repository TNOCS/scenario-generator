import Router from "vue-router";
import Vue from "vue";
import ShowView from "./views/show-view.vue";
import ScenarioView from "./views/scenario-view.vue";
import DimensionsView from "./views/dimensions-view.vue";
import ConsistencyView from "./views/consistency-view.vue";

Vue.use(Router);

export default new Router({
  base: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  routes: [
    { path: "/", redirect: { name: "dimensions" } },
    { path: "/add", name: "dimensions", component: DimensionsView },
    { path: "/consistency", name: "consistency", component: ConsistencyView },
    { path: "/create", name: "create", component: ScenarioView },
    { path: "/show", name: "show", component: ShowView },
  ]
})