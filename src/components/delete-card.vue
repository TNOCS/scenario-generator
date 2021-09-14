<template>
  <v-card>
    <v-card-title dense class="delete-card" v-if="activeNarrative">
      {{ $t('APP.DELETE', { item: $tc('COMP.NARRATIVE') }) | capitalize }} '{{ activeNarrative.name }}'
    </v-card-title>
    <v-card-text class="pb-0">
      {{ $t('APP.ARE_YOU_SURE') | capitalize }}
    </v-card-text>
    <v-card-actions>
      <v-spacer /> <v-btn color="primary" text @click="cancel"> {{ $t('APP.NO') }} </v-btn>
      <v-btn color="primary" text @click="deleteItem"> {{ $t('APP.YES') }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { INarrative, IScenario } from '../models';

@Component({
  components: {},
})
export default class DeleteCard extends Vue {
  private scenario?: Partial<IScenario> = {};
  private activeNarrative: INarrative | null = null;

  constructor() {
    super();
  }

  private cancel() {
    this.$emit('close');
  }

  private deleteItem() {
    if (!this.activeNarrative || !this.scenario || !this.scenario.id) return;
    const narrativeId = this.activeNarrative.id;
    const scenarios = this.$store.states().scenarios;
    const scenario = scenarios && scenarios.current;
    const narratives = scenario && scenario.narratives;
    const narrative =
      (narratives &&
        narratives.length &&
        narrativeId &&
        narratives
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .filter(n => n.id !== narrativeId)
          .pop()) ||
      ({ name: '' } as INarrative);
    console.log(`Deleting ${this.activeNarrative.name}`);
    this.$store.actions.scenarios.delNarrative(this.scenario.id, narrativeId);
    this.$store.actions.changeNarrative(narrative);
    this.$emit('close');
  }

  async mounted(): Promise<void> {
    this.$store.states.map(a => {
      this.scenario = a.scenarios.current;
      this.activeNarrative = a.app.narrative || ({} as INarrative);
    });
  }
}
</script>

<style scoped lang="css">
.delete-card {
  cursor: pointer;
}
</style>
