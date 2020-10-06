<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <v-card-title dense>
      {{ $tc("APP.ACTOR", 2) | capitalize }}
    </v-card-title>
    <v-card-text class="text-description">
      <Container>
        <Draggable v-for="item in actors" :key="item.id">
          <KanbanCard :item="item" />
        </Draggable>
      </Container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import KanbanCard from "./kanban-card.vue";

@Component({
  components: { Container, Draggable, KanbanCard },
})
export default class KanbanList extends Vue {
  private title: string = "Kanban";
  private time: number = 0;
  private timer?: any;
  private actors: Partial<IContent>[] = [];

  constructor() {
    super();
  }

  private async init() {
    await this.$store.actions.actors.updateList();
    this.$store.states.map((s) => {
      if (s.actors && s.actors.list) {
        this.actors = s.actors.list;
      }
    });
  }

  private formattedTime(): string {
    return lightFormat(this.time, "yyyy-MM-dd '@' HH:mm:ss");
  }

  private addActor(): void {
    this.$store.actions.actors.save({ id: uuidv4(), name: "Hannibal", type: "Actor" });
  }

  destroyed() {
    if (!!this.timer) return;
    clearInterval(this.timer);
  }

  mounted() {
    this.init();
  }
}
</script>

<style scoped lang="css"></style>
