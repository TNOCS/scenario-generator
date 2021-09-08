<template>
  <v-row class="mt-0 overflow-y-auto full-height" no-gutters>
    <v-col cols="12" class="full-height">
      <v-card-text class="text-description ma-0 pa-4 full-height">
        <div v-if="narrative && narrative.id" class="full-height">
          <div class="scenario-narrative full-height" v-html="getMarkdown(narrative.narrative)"></div>
        </div>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { INarrative } from '../models';
import { render } from 'slimdown-js';

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
    return render(text);
  }

  async mounted(): Promise<void> {
    console.log(`ScenarioText mounted`);
    await this.init();
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
.scenario-narrative > *:last-child {
  padding-bottom: 16px;
}
</style>
