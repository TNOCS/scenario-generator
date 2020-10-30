<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <splitpanes horizontal class="full-height">
          <pane min-size="10" size="20" class="pa-2">
            <ScenarioText></ScenarioText>
          </pane>
          <pane min-size="10" size="55" class="pa-2">
            <MapCard></MapCard>
          </pane>
          <pane min-size="10" size="25" class="pa-2">
            <NarrativeComponents></NarrativeComponents>
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

<style scoped lang="css"></style>
