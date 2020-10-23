<template>
  <v-card>
    <v-card-title dense class="table-card">
      {{ $t("APP.CONSISTENCIES") }}
    </v-card-title>
    <v-card-text class="pa-0"> TABLE {{ category }} </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ContextType, ContextTypes, IContent, IContext, IScenario } from "../models";
import { CollectionNames } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class TableCard extends Vue {
  @Prop({ default: "ThreatDirection" }) public category!: CollectionNames;

  constructor() {
    super();
  }

  async mounted() {
    console.log(`Table card mounted`);
  }
}
</script>

<style scoped lang="css">
.table-card {
}
</style>
