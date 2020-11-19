<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="nc-height full-width">
      <NarrativeComponents></NarrativeComponents>
    </v-row>
    <v-row no-gutters class="st-height full-width">
      <ScenarioText></ScenarioText>
    </v-row>
    <v-row no-gutters class="map-height full-width">
      <MapCard></MapCard>
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
  mounted() {
    console.log(`Show mounted`);
  }
}
</script>

<style scoped lang="css">
.full-width {
  width: 100%;
}
.nc-height {
  height: 300px;
}
.nc-height {
  height: 300px;
}
.map-height {
  height: calc(100% - 600px);
}
</style>
