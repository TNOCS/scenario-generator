<template>
  <v-card>
    <v-card-title dense class="delete-card" v-if="activeNarrative">
      {{ $t("APP.DELETE", { item: $tc("COMP.NARRATIVE") }) | capitalize }} '{{ activeNarrative.name }}'
    </v-card-title>
    <v-card-text class="pb-0">
      {{ $t("APP.ARE_YOU_SURE") | capitalize }}
    </v-card-text>
    <v-card-actions>
      <v-spacer /> <v-btn color="primary" text @click="cancel"> {{ $t("APP.NO") }} </v-btn>
      <v-btn color="primary" text @click="deleteItem"> {{ $t("APP.YES") }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent, INarrative, IScenario } from "../models";
import { getUuid } from "../utils/constants";
import filesaver from "file-saver";
import { CollectionNamesPlusArr } from "../services/meiosis";

@Component({
  components: {},
})
export default class DeleteCard extends Vue {
  private scenario?: Partial<IScenario> = {};
  private activeNarrative: INarrative | null = null;

  constructor() {
    super();
  }

  private async deleteItem() {
    console.log(`deleteItem`);
    if (!this.scenario || !this.activeNarrative || !this.activeNarrative.id) return;
    if (!this.scenario.narratives) {
      this.scenario.narratives = [];
    } else {
      this.scenario.narratives = this.scenario.narratives.filter(n => n.id != (this.activeNarrative ? this.activeNarrative.id : ''));
    }
    await this.$store.actions["scenarios"].save(this.scenario);
    await this.$store.actions["scenarios"].load(this.scenario!.id!);
    await this.$store.actions.changeNarrative(({
      id: undefined,
      narrative: undefined,
      name: undefined,
      components: undefined,
    } as unknown) as INarrative);
    this.$emit("close");
  }

  private async cancel() {
    this.$emit("close");
  }

  async mounted() {
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
