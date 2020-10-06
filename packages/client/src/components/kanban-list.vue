<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <v-card-title dense>
       {{ title | capitalize }}
    </v-card-title>
    <v-card-text class="text-description">
      <Container>
        <Draggable v-for="(item, id) in items" :key="id">
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
import { CollectionNames, TranslateKeys } from "../services/meiosis";
import KanbanCard from "./kanban-card.vue";

@Component({
  components: { Container, Draggable, KanbanCard },
})
export default class KanbanList extends Vue {
  @Prop({ default: "" }) public itemkey!: CollectionNames;
  private items: Partial<IContent>[] = [];
  private title: string = "";

  @Watch("itemkey")
  private itemkeyChanged() {
    this.init();
  }

  constructor() {
    super();
  }

  private async init() {
    if (!this.itemkey || !this.itemkey.length) return;
    this.title = this.$tc(`APP.${TranslateKeys[this.itemkey]}`, 2);
    await this.$store.actions[this.itemkey].updateList();
    this.$store.states.map((s) => {
      this.items = s[this.itemkey].list!;
    });
  }

  mounted() {
    console.log(`KanbanList mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css"></style>
