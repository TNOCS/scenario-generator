<template>
  <v-app-bar app dense flat clipped-left height="42" class="ind-app-bar noselect font-weight-light no-print">
    <v-icon class="home-icon pr-3" @click="openDrawer">mdi-menu</v-icon>
    <v-toolbar-title>V2018 Scenario Generator</v-toolbar-title>
    <div class="text-center">
      <v-btn class="ml-8 mx-2 my-2 app-btn" outlined :to="'add'" small color="blue">
        <v-icon left>mdi-plus</v-icon>{{ $tc("APP.DIMENSION", 2) }}
      </v-btn>
      <v-btn class="mx-2 my-2 app-btn" outlined :to="'consistency'" small color="blue">
        <v-icon left>mdi-domain</v-icon>{{ $tc("APP.CONSISTENCY", 2) }}
      </v-btn>
      <v-btn class="mx-2 my-2 app-btn" outlined :to="'create'" small color="blue">
        <v-icon left>mdi-pencil</v-icon>{{ $t("APP.CREATE_SCENARIO") }}
      </v-btn>
      <v-btn class="mx-2 my-2 app-btn" outlined :to="'show'" small color="blue">
        <v-icon left>mdi-graph-outline</v-icon>{{ $t("APP.SHOW_SCENARIO") }}
      </v-btn>
      <v-btn class="mx-2 my-2 app-btn" outlined :to="'about'" small color="blue">
        <v-icon left>mdi-help-circle-outline</v-icon>{{ $t("APP.ABOUT") }}
      </v-btn>
    </div>
    <v-spacer />
    <v-sheet class="blue px-2 d-flex" height="100%" tile>
      <a href="https://www.tno.nl" target="_blank" class="tno-link">
        <v-img :src="require('../assets/tno.png')" max-width="50" contain />
      </a>
    </v-sheet>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { IScenario } from "../models";

@Component({
  components: {},
})
export default class AppBar extends Vue {
  private scenario: Partial<IScenario> = {};

  private openDrawer() {
    this.$store.actions.toggleDrawer(true);
  }

  async mounted() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current!;
    });
  }
}
</script>

<style lang="css">
.home-icon:active {
  color: #ff9800;
}
.v-icon--link::after {
  opacity: 0 !important;
}
.v2018-app-bar .v-toolbar__content {
  padding-right: 0;
}
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 98vh;
}
.flexcard {
  display: flex;
  flex-direction: column;
}
.v-toolbar__content {
  padding-right: 0;
}
.tno-link {
  display: flex;
  vertical-align: middle;
}
</style>
