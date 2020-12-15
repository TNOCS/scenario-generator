<template>
  <div>
    <v-row class="mt-0" no-gutters>
      <v-col cols="12">
        <v-card-text class="text-description ma-0 pa-4">
          <div v-if="narrative && narrative.id">
            <span class="scenario-narrative" v-html="getMarkdown(narrative.narrative)"></span>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, INarrative, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import marked from "marked";
import dompurify from "dompurify";

@Component({
  components: {},
})
export default class ScenarioTextVert extends Vue {
  private narrative: INarrative = {} as INarrative;
  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map(s => {
      this.narrative = s.app.narrative;
    });
  }

  private getMarkdown(text: string): string {
    return marked(text, { sanitizer: dompurify.sanitize });
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
.scenario-narrative h1,
.scenario-narrative h2,
.scenario-narrative h3 {
  padding-top: 4px;
  padding-bottom: 8px;
}
</style>
