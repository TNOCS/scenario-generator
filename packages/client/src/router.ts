import Router from "vue-router";
import Vue from "vue";
import ShowView from "./views/show-view.vue";
import ScenarioView from "./views/scenario-view.vue";
import ComponentsView from "./views/components-view.vue";

Vue.use(Router);

export default new Router({
  base: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  routes: [
    { path: "/", redirect: { name: "components" } },
    { path: "/add", name: "components", component: ComponentsView },
    { path: "/create", name: "create", component: ScenarioView },
    { path: "/show", name: "show", component: ShowView },
  ]
})