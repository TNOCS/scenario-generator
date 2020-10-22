<template>
  <v-card tile class="flex-card ma-1 kanban-card" elevation="2" color="accent">
    <v-card-title class="px-4 pt-2 pb-0">
      {{ item.name }}
      <v-spacer />
      <v-btn @click="deleteItem" color="secondary" icon x-small class="mr-2">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="text-description">
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <div v-on="on" v-bind="attrs">
            <v-icon color="secondary" small>mdi-note-plus-outline</v-icon>
            <span class="secondary--text"> {{ getContext(item) }}</span>
          </div>
        </template>
        <AddContextCard :item="item" @close="closeMenu"></AddContextCard>
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent, IScenario } from "../models";
import AddContextCard from "./add-context-card.vue";

@Component({
  components: { AddContextCard },
})
export default class KanbanCard extends Vue {
  @Prop({ default: () => {} }) public item!: Partial<IContent>;
  private menu: boolean = false;

  constructor() {
    super();
  }

  private getContext(item: Partial<IContent>): string {
    if (!item || !item.context || !item.context.type)
      return this.$options.filters!.capitalize(this.$t("APP.ADD_CONTEXT"));
    return item.context.type;
  }

  private async selectItem() {
    this.$store.actions[this.item.type!].load(this.item.id!);
  }

  private async deleteItem() {
    this.$store.actions[this.item.type!].del(this.item.id!);
  }

  private closeMenu() {
    this.menu = false;
  }

  async mounted() {}
}
</script>

<style scoped lang="css">
.kanban-card {
  cursor: initial;
}
.kanban-context {
  cursor: pointer;
}
</style>
