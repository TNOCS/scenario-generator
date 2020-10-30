<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">
      {{ `${$t("APP.SHOW_SCENARIO")}` }}
      <span style="float: right">
        <v-btn icon><v-icon>mdi-info</v-icon></v-btn>
      </span>
    </div>
    <v-divider />
    <v-card-text class="text-description ma-0 pa-1">
      <div v-if="narrative && narrative.id">
        <span class="scenario-narrative">{{ narrative.narrative }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, INarrative, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class ScenarioText extends Vue {
  private narrative: INarrative = {} as INarrative;

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map(s => {
      this.narrative = s.app.narrative;
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
