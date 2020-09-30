import Router from "vue-router";
import Vue from "vue";
import ShowView from "./views/show-view.vue";
import EditorView from "./views/editor-view.vue";

Vue.use(Router);

export default new Router({
  base: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  routes: [
    { path: "/", redirect: { name: "editor" } },
    { path: "/edit", name: "editor", component: EditorView },
    { path: "/show", name: "show", component: ShowView },
  ]
})