<template>
  <v-app-bar app dense flat clipped-left height="42" class="ind-app-bar noselect font-weight-light no-print">
    <v-icon class="home-icon pr-3" @click="openDrawer">mdi-menu</v-icon>
    <v-toolbar-title>V2018 Scenario Generator</v-toolbar-title>
    <div class="text-center app-bar-buttons">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="ml-8 mx-2 my-2 app-btn" outlined :to="'add'" small color="blue">
            <v-icon left>mdi-plus</v-icon><span class="app-bar-titles">{{ $tc('APP.DIMENSION', 2) }}</span>
          </v-btn>
        </template>
        <span>{{ $tc('APP.DIMENSION', 2) | capitalize }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="mx-2 my-2 app-btn" outlined :to="'consistency'" small color="blue">
            <v-icon left>mdi-domain</v-icon><span class="app-bar-titles">{{ $tc('APP.CONSISTENCY', 2) }}</span>
          </v-btn>
        </template>
        <span>{{ $tc('APP.CONSISTENCY', 2) | capitalize }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="mx-2 my-2 app-btn" outlined :to="'create'" small color="blue">
            <v-icon left>mdi-pencil</v-icon><span class="app-bar-titles">{{ $t('APP.CREATE_SCENARIO') }}</span>
          </v-btn>
        </template>
        <span>{{ $t('APP.CREATE_SCENARIO') | capitalize }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="mx-2 my-2 app-btn" outlined :to="'show'" small color="blue">
            <v-icon left>mdi-graph-outline</v-icon><span class="app-bar-titles">{{ $t('APP.SHOW_SCENARIO') }}</span>
          </v-btn>
        </template>
        <span>{{ $t('APP.SHOW_SCENARIO') | capitalize }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="px-1 mx-2 my-2 app-btn" outlined :to="'about'" small color="blue">
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('APP.ABOUT') | capitalize }}</span>
      </v-tooltip>
    </div>
    <div class="blue--text pr-2 pl-6 narr-selector-title">{{ $tc('COMP.NARRATIVE') | capitalize }}:</div>
    <div class="text-center narr-selector">
      <!-- prettier-ignore -->
      <v-select v-model="activeNarrative" :items="sortedNarratives" item-text="name" return-object 
          dense hide-details @change="narrativeSelected"></v-select>
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
import { Component, Vue } from 'vue-property-decorator';
import { INarrative, IScenario } from '../models';
import { sortBy } from 'lodash';

@Component({
  components: {},
})
export default class AppBar extends Vue {
  private scenario: Partial<IScenario> | undefined = {};
  private activeNarrative: INarrative = {} as INarrative;

  private get sortedNarratives() {
    return this.scenario && this.scenario.narratives ? sortBy(this.scenario.narratives, 'name') : [];
  }

  private async narrativeSelected() {
    this.$store.actions.changeNarrative(this.activeNarrative);
  }

  private openDrawer() {
    this.$store.actions.toggleDrawer(true);
  }

  async mounted(): Promise<void> {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current;
      this.activeNarrative = s.app.narrative || ({} as INarrative);
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
.narr-selector {
  max-width: 280px !important;
}
@media only screen and (min-width: 1500px) and (max-width: 1600px) {
  .app-bar-buttons {
    white-space: nowrap;
    overflow: hidden;
  }
  .app-bar-titles {
    max-width: 92px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
@media only screen and (min-width: 1350px) and (max-width: 1500px) {
  .app-bar-buttons {
    white-space: nowrap;
    overflow: hidden;
  }
  .app-bar-titles {
    max-width: 64px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
@media only screen and (max-width: 1350px) {
  .app-bar-buttons {
    white-space: nowrap;
    overflow: hidden;
  }
  .app-bar-titles {
    display: none;
  }
  .narr-selector {
    max-width: 220px !important;
  }
}

@media only screen and (max-width: 1050px) {
  .narr-selector-title,
  .narr-selector {
    display: none;
  }
}
</style>
