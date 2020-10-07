<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <ScenarioBuilder/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import "splitpanes/dist/splitpanes.css";
import { Splitpanes, Pane } from "splitpanes";
import DescriptionCard from "../components/description-card.vue";
import ScenarioBuilder from "../components/scenario-builder.vue";

@Component({
  components: { ScenarioBuilder },
})
export default class ScenarioView extends Vue {
  mounted() {
    console.log(`ScenarioView mounted`);
  }
}
</script>

<style scoped lang="css"></style>
