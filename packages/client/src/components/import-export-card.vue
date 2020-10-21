<template>
  <v-card>
    <v-card-title dense class="add-component-card">
      {{ $t("APP.IMPORT_EXPORT_TITLE") }}
    </v-card-title>
    <v-card-text class="pb-0">
      <span>
        <v-btn color="accent darken-1" @click="importItem">
          <v-icon left> mdi-file-import </v-icon>{{ $t("APP.IMPORT") }}
        </v-btn>
        <v-btn class="ml-2" color="accent darken-1" @click="exportItem">
          <v-icon left> mdi-file-export </v-icon>{{ $t("APP.EXPORT") }}
        </v-btn>
      </span>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel"> {{ $t("APP.CANCEL") }} </v-btn>
      <v-btn color="primary" text @click="addItem"> {{ $t("APP.SAVE") }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent, IScenario } from "../models";
import { getUuid } from "../utils/constants";
import filesaver from "file-saver";

@Component({
  components: {},
})
export default class ImportExportCard extends Vue {
  constructor() {
    super();
  }

  private async importItem() {
    this.$emit("close");
  }

  private async exportItem() {
    let state;
    this.$store.states.map((s) => {
      state = JSON.stringify(s);
    });
    const blob = new Blob([`${state}`], { type: "text/plain;charset=utf-8" });
    filesaver.saveAs(blob, `scenario-${lightFormat(new Date(), "yyyy-MM-dd'T'HH_mm_ss")}.json`);
    this.$emit("close");
  }

  async mounted() {}
}
</script>

<style scoped lang="css">
.add-component-card {
  cursor: pointer;
}
</style>
