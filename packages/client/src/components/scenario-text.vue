<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">
      {{ `3. ${$t("APP.SHOW_SCENARIO")}` }}
      <span style="float: right">
        <v-btn icon><v-icon>mdi-info</v-icon></v-btn>
      </span>
    </div>
    <v-divider />
    <v-card-text class="text-description ma-0 pa-1">
      <div v-if="scenario && scenario.narratives">
        <span class="scenario-narrative" v-for="(nar, idx) in scenario.narratives" :key="idx">{{ nar.narrative }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class ScenarioText extends Vue {
  private scenario?: Partial<IScenario> = {};

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current;
    });
  }

  mounted() {
    console.log(`ScenarioText mounted`);
    this.init();
  }
}
</script>

<style lang="css">
.scenario-sentence {
  display: inline;
  font-size: 150%;
  padding-right: 6px;
}
</style>
