<template>
  <div>
    <v-card dense flat tile class="flex-card " style="background: lightgrey">
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="ma-0 pa-0">
          <v-row no-gutters>
            <v-col md="2">
              {{ $t("APP.ACTIVE_SCENARIO") | capitalize }}
            </v-col>
            <v-col md="10">
              Nothing
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ $tc("APP.SENTENCE", 2) }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="ma-0 pa-0">
          <v-row no-gutters>
            <v-col v-for="(val, i) in columns" :key="i">
              {{ val }}
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class ScenarioBuilder extends Vue {
  private columns: Array<CollectionNames> = [];

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      this.columns.length = 0;
      CollectionNamesArr.forEach((n) => {
        this.columns.push(n);
      });
    });
  }

  private onCardDrop(id: string, evt: any) {
    console.log(`Drop ${id}`);
  }

  private getCardPayload(id: string) {
    console.log(`getCardPayload ${id}`);
    return id;
  }

  mounted() {
    console.log(`KanbanLists mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css"></style>
