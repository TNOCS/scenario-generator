<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <splitpanes horizontal class="full-height">
          <pane min-size="10" size="50">
            <SentenceBuilder />
          </pane>
          <pane min-size="10" size="50">
            <ScenarioBuilder />
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
import ScenarioBuilder from "../components/scenario-builder.vue";
import SentenceBuilder from "../components/sentence-builder.vue";

@Component({
  components: { ScenarioBuilder, SentenceBuilder, Splitpanes, Pane },
})
export default class ScenarioView extends Vue {
  private init() {
    this.$store.states.map((s) => {
      if (!s.scenarios.current && s.scenarios.list!.length > 0) {
        this.$store.actions.scenarios.load(s.scenarios.list![0].id!);
      }
    });
  }

  mounted() {
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
