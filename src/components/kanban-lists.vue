<template>
  <div>
    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab v-for="catName in categoryNames" :key="catName">
        {{ catName }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(val, cat) in categories" :key="cat">
        <v-card dense flat tile class="flex-card" style="background: transparent">
          <div class="overline px-2 py-0">{{ $tc('APP.DIMENSION', 2) }}</div>
          <v-card-text class="text-description ma-0 pa-2">
            <v-container fluid class="ma-0 pa-0">
              <v-row no-gutters v-for="(val, i) in getCategoryRows(cat)" :key="i" class="kanban-col">
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
import { Component, Vue } from 'vue-property-decorator';
import { ContentCategory } from '../models';
import { CollectionNames, CollectionNamesArr } from '../services/meiosis';
import KanbanList from './kanban-list.vue';

@Component({
  components: { KanbanList },
})
export default class KanbanLists extends Vue {
  private rows: Array<CollectionNames> = [];
  private tab = 0;
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private categoryNames: ContentCategory[] = [];

  constructor() {
    super();
  }

  private getCategoryRows(cat: ContentCategory) {
    return this.rows.filter(r => this.categories[cat].includes(r));
  }

  private async init() {
    this.$store.states.map(s => {
      this.rows.length = 0;
      CollectionNamesArr.forEach(n => {
        this.rows.push(n);
      });
      this.categories =
        s.scenarios.current && s.scenarios.current.categories
          ? s.scenarios.current.categories
          : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
    });
  }

  private onCardDrop(id: string) {
    console.log(`Drop ${id}`);
  }

  private getCardPayload(id: string) {
    console.log(`getCardPayload ${id}`);
    return id;
  }

  async mounted(): Promise<void> {
    console.log(`KanbanLists mounted`);
    await this.init();
  }
}
</script>

<style scoped lang="css">
.kanban-col {
  min-width: 320px;
}
</style>
