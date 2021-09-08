<template>
  <v-expansion-panel class="no-background">
    <v-expansion-panel-header dense class="no-background">
      <v-tooltip left slot="actions">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on" v-bind="attrs"> mdi-chevron-down </v-icon>
        </template>
        <span> {{ $t('APP.OPEN_CLOSE') }}</span>
      </v-tooltip>
      <div class="overline px-2 py-0 full-width">
        {{ $tc('COMP.NARRATIVE') }}
        <!-- <v-divider /> -->
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card-text class="text-description ma-0 pa-4">
        <div v-if="narrative && narrative.id">
          <span class="scenario-narrative" v-html="getMarkdown(narrative.narrative)"></span>
        </div>
      </v-card-text>
    </v-expansion-panel-content>
    <v-divider />
  </v-expansion-panel>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { INarrative } from '../models';
import { render } from 'slimdown-js';

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
</style>
