<template>
  <v-card>
    <v-card-title dense class="add-component-card">
      {{ $t("APP.IMPORT_EXPORT_TITLE") }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-card>
        <div class="overline px-2 py-2">{{ $t("APP.IMPORT") }}</div>
        <v-divider />
        <v-card-text class="pa-0">
          <v-file-input v-model="file" accept="application/json" show-size truncate-length="20" label="Open"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer /> <v-btn color="accent darken-1" @click="importItem"> <v-icon left> mdi-file-import </v-icon>{{ $t("APP.IMPORT") }} </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mt-1">
        <div class="overline px-2 py-2">{{ $t("APP.EXPORT") }}</div>
        <v-divider />
        <v-card-actions>
          <v-spacer /><v-btn class="ml-2" color="accent darken-1" @click="exportItem">
            <v-icon left> mdi-file-export </v-icon>{{ $t("APP.EXPORT") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
    <v-card-actions>
      <v-spacer /> <v-btn color="primary" text @click="cancel"> {{ $t("APP.DONE") }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent, IScenario } from "../models";
import { getUuid } from "../utils/constants";
import filesaver from "file-saver";
import { CollectionNamesPlusArr } from "../services/meiosis";

@Component({
  components: {},
})
export default class ImportExportCard extends Vue {
  private file: File | null = null;
  private fileJson: string = "";

  constructor() {
    super();
  }

  private async openFiles(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.file) {
        let filename = this.file.name;
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.file = null;
          if (fileReader.result) {
            resolve(fileReader.result.toString());
          } else {
            reject();
          }
        });
        fileReader.readAsText(this.file);
      } else {
        console.warn(`No files selected`);
        this.file = null;
        reject();
      }
    });
  }

  private async importItem(state: string) {
    console.log(`Import`);
    try {
      this.fileJson = await this.openFiles();
      this.$store.actions.importState(this.fileJson);
      CollectionNamesPlusArr.forEach(async (n) => {
        if (this.$store.actions.hasOwnProperty(n)) await this.$store.actions[n].saveList();
      });
    } catch (error) {
      console.warn(`No files uploaded`);
    }
    this.$emit("close");
  }

  private async exportItem() {
    console.log(`Export`);
    let state = this.$store.actions.exportState();
    const blob = new Blob([`${state}`], { type: "text/plain;charset=utf-8" });
    filesaver.saveAs(blob, `scenario-${lightFormat(new Date(), "yyyy-MM-dd'T'HH_mm_ss")}.json`);
    this.$emit("close");
  }

  private async cancel() {
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
