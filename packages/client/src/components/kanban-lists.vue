<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">{{ $tc("APP.COMPONENT", 2) }}</div>
    <v-card-text class="text-description">
      <v-container fluid>
        <v-row no-gutters>
          <v-col v-for="(val, i) in columns" :key="i">
            <KanbanList :itemkey="val" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import KanbanList from "./kanban-list.vue";

@Component({
  components: { KanbanList },
})
export default class KanbanLists extends Vue {
  private title: string = "Kanban";
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

  private addActor(): void {
    this.$store.actions.actors.save({ id: uuidv4(), name: "Hannibal", type: "Actor" });
  }

  mounted() {
    console.log(`KanbanLists mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css"></style>
