<template>
  <v-app id="app">
    <AppBar />
    <NavigationDrawer />
    <v-main id="content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import AppBar from "./components/app-bar.vue";
import NavigationDrawer from "./components/navigation-drawer.vue";
import { Route } from "vue-router";
import { CollectionNamesPlusArr } from "./services/meiosis";
import { IScenario } from "./models";

@Component({
  components: {
    AppBar,
    NavigationDrawer,
  },
})
export default class App extends Vue {
  private theme: string = "";
  private scenarios?: Partial<IScenario>[] = [];
  private activeScenario?: Partial<IScenario> = {};

  constructor() {
    super();
    console.log(CollectionNamesPlusArr);
    CollectionNamesPlusArr.forEach(async n => {
      if (this.$store.actions.hasOwnProperty(n)) await this.$store.actions[n].updateList();
    });
  }

  @Watch("scenarios")
  private scenariosUpdated() {
    if (!this.activeScenario && this.scenarios && this.scenarios.length > 0) {
      this.$store.actions["scenarios"].load(this.scenarios![0]!.id!);
    }
  }

  @Watch("activeScenario")
  private activeScenarioUpdated() {
    if (this.activeScenario && this.activeScenario.id) {
      if (!this.$store.states().app.narrative || !this.$store.states().app.narrative.id) {
        if (this.activeScenario.narratives && this.activeScenario.narratives.length > 0) {
          this.$store.actions.changeNarrative(this.activeScenario.narratives[0]!);
        }
      }
    }
  }

  @Watch("theme")
  themeUpdated(theme: string) {
    this.$vuetify.theme.dark = theme === "dark" ? true : false;
  }

  @Watch("$route")
  routeUpdated(to: Route, from: Route) {
    if (`/${this.$store.states().app.route}` !== to.path) {
      this.$store.actions.changePage(to.path);
    }
  }

  public mounted() {
    this.$store.states.map(s => {
      this.theme = s.app.theme;
      this.scenarios = s.scenarios.list;
      this.activeScenario = s.scenarios.current;
    });
  }
}
</script>

<style lang="css">
html {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100%;
}

#content {
  height: calc(100% - 35px);
  width: 100%;
  overflow: auto;
}

.stretch {
  height: 100% !important;
}

.splitpanes__splitter {
  position: relative;
  opacity: 0;
  transition: opacity 0.4s;
  margin: 10px 10px;
}

.splitpanes__splitter:hover {
  background-color: rgb(145, 145, 145);
  opacity: 0.5;
}

.splitpanes__splitter:active {
  background-color: #ff9800;
  opacity: 0.5;
}

.splitpanes__splitter:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
}

.splitpanes--vertical > .splitpanes__splitter:before {
  left: -10px;
  right: -10px;
  height: 100%;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -10px;
  bottom: -10px;
  width: 100%;
}

.flex-card {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.noselect {
  user-select: none;
}

.nooverflow {
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
