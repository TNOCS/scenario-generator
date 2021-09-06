<template>
  <v-container class="no-scroll full-height pa-0" fluid>
    <v-row no-gutters class="full-width full-height">
      <v-col md="12" cols="12" class="full-height">
        <splitpanes vertical class="full-height">
          <pane min-size="10" size="50" class="pa-0">
            <splitpanes horizontal class="full-height">
              <pane min-size="10" size="60" class="pa-2">
                <NarrativeComponentsVert></NarrativeComponentsVert>
              </pane>
              <pane min-size="10" size="40" class="pa-2">
                <ScenarioTextVert></ScenarioTextVert>
              </pane>
            </splitpanes>
          </pane>
          <pane min-size="10" size="50" class="pa-2">
            <MapCard></MapCard>
          </pane>
        </splitpanes>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import "splitpanes/dist/splitpanes.css";
import { Splitpanes, Pane } from "splitpanes";
import MapCard from "../components/map-card.vue";
import DescriptionCard from "../components/description-card.vue";
import ScenarioTextVert from "../components/scenario-text-vert.vue";
import NarrativeComponentsVert from "../components/narrative-components-vert.vue";
// import ScenarioText from "../components/scenario-text.vue";
// import NarrativeComponents from "../components/narrative-components.vue";

@Component({
  components: { Splitpanes, Pane, DescriptionCard, NarrativeComponentsVert, MapCard, ScenarioTextVert },
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
