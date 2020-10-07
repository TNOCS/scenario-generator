<template>
  <v-card dense flat tile class="flex-card" color="secondary">
    <v-card-title dense>
      {{ title | capitalize }}
      <v-spacer />
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" color="accent darken-1" fab small elevation="2" class="mr-2">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title dense class="kanban-menu">
            {{ $t("APP.ADD", { item: $tc(`APP.${this.getTranslateKey()}`) }) }}
          </v-card-title>
          <v-card-text class="pb-0">
            <v-text-field label="Name" v-model="newItem.name" autofocus v-on:keyup.enter="addItem"></v-text-field>
            <v-text-field label="Type" disabled v-model="newItem.type">itemkey</v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="menu = false"> Cancel </v-btn>
            <v-btn color="primary" text @click="addItem"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import { CollectionNames, TranslateKeys } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import KanbanCard from "./kanban-card.vue";

@Component({
  components: { Container, Draggable, KanbanCard },
})
export default class KanbanList extends Vue {
  @Prop({ default: "" }) public itemkey!: CollectionNames;
  private items: Partial<IContent>[] = [];
  private title: string = "";
  private menu: boolean = false;
  private newItem: Partial<IContent> = {};

  @Watch("itemkey")
  private itemkeyChanged() {
    this.init();
  }

  constructor() {
    super();
  }

  private resetNewItem() {
    this.newItem = { name: "", type: this.itemkey, id: getUuid() };
  }

  private getTranslateKey() {
    return TranslateKeys[this.itemkey] || "";
  }

  private async init() {
    if (!this.itemkey || !this.itemkey.length) return;
    this.resetNewItem();
    this.title = this.$tc(`APP.${this.getTranslateKey()}`, 2);
    await this.$store.actions[this.itemkey].updateList();
    this.$store.states.map((s) => {
      this.items = s[this.itemkey].list!;
    });
  }

  private async addItem() {
    this.$store.actions[this.itemkey].save(this.newItem);
    this.resetNewItem();
    this.menu = false;
  }

  mounted() {
    console.log(`KanbanList mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css">
.kanban-menu {
  padding: 8px 16px;
}
</style>
