<template>
  <v-container class="no-scroll full-height pa-0" fluid>
    <v-row no-gutters class="full-width full-height">
      <v-expansion-panels multiple accordion v-model="panels" class="no-background">
        <NarrativeComponents></NarrativeComponents>
        <ScenarioText></ScenarioText>
        <MapCard></MapCard>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import "splitpanes/dist/splitpanes.css";
import { Splitpanes, Pane } from "splitpanes";
import MapCard from "../components/map-card.vue";
import DescriptionCard from "../components/description-card.vue";
import ScenarioText from "../components/scenario-text.vue";
import NarrativeComponents from "../components/narrative-components.vue";

@Component({
  components: { Splitpanes, Pane, DescriptionCard, NarrativeComponents, MapCard, ScenarioText },
})
export default class ShowView extends Vue {
  private panels: number[] = [0, 1, 2];

  mounted() {
    console.log(`Show mounted`);
  }
}
</script>

<style scoped lang="css">
.full-width {
  width: 100%;
}
.map-height {
  height: calc(100% - 640px);
}
.no-scroll.full-height {
  height: 100% !important;
  overflow-x: hidden;
}
</style>
