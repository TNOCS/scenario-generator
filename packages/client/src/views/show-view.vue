<template>
  <v-container class="full-height py-0" fluid>
    <v-row class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <splitpanes vertical class="full-height">
          <pane min-size="10" size="50">
            <ChartCard />
          </pane>
          <pane min-size="10" size="50">
            <DescriptionCard
              html="<h3>Hello world</h3><br/><a href='https://www.defensie.nl' target='_blank'>TensorFlow</a>"
            ></DescriptionCard>
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
import DescriptionCard from "../components/description-card.vue";
import ChartCard from "../components/chart-card.vue";

@Component({
  components: { Splitpanes, Pane, DescriptionCard, ChartCard },
})
export default class ShowView extends Vue {
  mounted() {
    console.log(`Show mounted`);
  }
}
</script>

<style scoped lang="css"></style>
