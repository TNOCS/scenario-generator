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
      {{ item.id }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent } from "../models";

@Component({
  components: {},
})
export default class KanbanCard extends Vue {
  @Prop({ default: () => {} }) public item!: Partial<IContent>;

  constructor() {
    super();
  }

  private async deleteItem() {
    this.$store.actions[this.item.type!].del(this.item.id!);
  }

  mounted() {}
}
</script>

<style scoped lang="css">
.kanban-card {
  cursor: pointer;
}
.kanban-title {
}
</style>
