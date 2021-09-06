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
