<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height pa-2">
        <ScenarioGenerator />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ScenarioGenerator from '../components/scenario-generator.vue';

@Component({
  components: { ScenarioGenerator },
})
export default class ScenarioView extends Vue {
  private init() {
    this.$store.states.map(s => {
      if (!s.scenarios.current && s.scenarios.list && s.scenarios.list.length > 0) {
        const id = s.scenarios.list[0].id;
        id && this.$store.actions.scenarios.load(id);
      }
    });
  }

  mounted(): void {
    console.log(`ScenarioView mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css">
.full-height {
  height: 100%;
}
</style>
