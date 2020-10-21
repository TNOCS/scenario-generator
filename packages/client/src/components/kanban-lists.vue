<template>
  <div>
    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab v-for="cat in categories" :key="cat">
        {{ cat }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="cat in categories" :key="cat">
        <v-card dense flat tile class="flex-card" style="background: transparent">
          <div class="overline px-2 py-0">{{ $tc("APP.COMPONENT", 2) }}</div>
          <v-card-text class="text-description ma-0 pa-2">
            <v-container fluid class="ma-0 pa-0">
              <v-row no-gutters v-for="(val, i) in columns" :key="i" class="kanban-col">
                <v-col cols="12" class="my-1 elevation-1">
                  <KanbanList :itemkey="val" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import KanbanList from "./kanban-list.vue";

@Component({
  components: { KanbanList },
})
export default class KanbanLists extends Vue {
  private columns: Array<CollectionNames> = [];
  private tab: number = 0;
  private categories: string[] = [];

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      this.columns.length = 0;
      CollectionNamesArr.forEach((n) => {
        if (n != "scenarios") this.columns.push(n);
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

<style scoped lang="css">
.kanban-col {
  min-width: 320px;
}
</style>
