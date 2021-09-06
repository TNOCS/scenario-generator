<template>
  <v-card tile class="flex-card ma-1 kanban-card" elevation="2" color="accent">
    <v-card-title class="px-4 pt-2 pb-0 k-c-title">
      <div class="k-c-title-text">
        {{ item.name }}
      </div>
      <v-spacer />
      <v-btn @click="deleteItem" color="secondary" icon x-small class="k-c-btn">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="text-description">
      <div class="not-on-hover" v-if="hasContext(item)">
        <span class="secondary--text"> {{ getContext(item) }}</span>
      </div>
      <div class="only-on-hover">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <v-icon color="secondary" small>mdi-note-plus-outline</v-icon>
              <span class="secondary--text"> {{ getContext(item) }}</span>
            </div>
          </template>
          <AddContextCard :item="item" @close="closeMenu"></AddContextCard>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IContent } from '../models';
import AddContextCard from './add-context-card.vue';

@Component({
  components: { AddContextCard },
})
export default class KanbanCard extends Vue {
  @Prop({ default: () => ({}) }) public item!: Partial<IContent>;
  private menu = false;

  constructor() {
    super();
  }

  private hasContext(item: Partial<IContent>): boolean {
    return !!item && !!item.context && !!item.context.type;
  }

  private getContext(item: Partial<IContent>): string {
    if (!item || !item.context || !item.context.type)
      return this.$options.filters && this.$options.filters.capitalize(this.$t('APP.ADD_CONTEXT'));
    return item.context.type;
  }

  private async selectItem() {
    this.item.type && this.item.id && this.$store.actions[this.item.type].load(this.item.id);
  }

  private async deleteItem() {
    this.item.type && this.item.id && this.$store.actions[this.item.type].del(this.item.id);
  }

  private closeMenu() {
    this.menu = false;
  }

  mounted(): void {
    return;
  }
}
</script>

<style scoped lang="css">
.kanban-card {
  cursor: initial;
  max-width: 240px;
  min-width: 200px;
}
.kanban-context {
  cursor: pointer;
}
.k-c-title-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: calc(100% - 20px);
}
.k-c-btn {
  margin: 0px;
  padding: 0px;
}
.kanban-card:hover .only-on-hover {
  display: block;
}
.kanban-card .only-on-hover,
.kanban-card:hover .not-on-hover {
  display: none;
}

.kanban-card .text-description {
  min-height: 2.5rem;
}
</style>
