<template>
  <div>
    <v-btn class="float-right mr-2 mt-1" color="accent" @click="copyToClipboard" fab dark small>
      <v-icon>mdi-clipboard-arrow-up-outline</v-icon>
    </v-btn>
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
            <!-- If kanban is vertical -->
            <v-container v-if="verticalDirection" fluid class="ma-0 pa-0">
              <v-row no-gutters class="kanban-col">
                <v-col v-for="(val, i) in getCategoryRows(cat)" :key="i" style="max-width: 280px" class="my-1 elevation-1">
                  <KanbanList :itemkey="val" :vertical-direction="verticalDirection" />
                </v-col>
              </v-row>
            </v-container>

            <!-- If kanban is horizontal -->
            <v-container v-if="!verticalDirection" fluid class="ma-0 pa-0">
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
import { CollectionType } from '@/services/states/collection-state';
import { capitalize, range } from 'lodash';
import { render } from 'slimdown-js';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ContentCategory, IContent } from '../models';
import { CollectionNames, CollectionNamesArr } from '../services/meiosis';
import KanbanList from './kanban-list.vue';
import { htmlTemplate, cssTable } from '../assets/html-styles';

@Component({
  components: { KanbanList },
})
export default class KanbanLists extends Vue {
  @Prop() public verticalDirection!: boolean;
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

  private copyToClipboard() {
    const category = this.categories[this.categoryNames[this.tab]];
    const state = this.$store.states();
    const scenario = state.scenarios.current;
    const narratives = scenario && scenario.narratives && scenario.narratives.filter(n => n.included);
    const includedComponents = category.reduce((acc, cur) => {
      acc[cur] = narratives ? narratives.map(n => n.components[cur]) : [];
      return acc;
    }, {} as { [key: string]: string[] });
    const included = (collectionName: string, item: Partial<IContent>) =>
      includedComponents[collectionName].indexOf(item.id || '') >= 0 ? `**${item.name}**` : item.name;

    const headers = `|${category.map(c => capitalize(this.$tc(`COMP.${c.toLocaleUpperCase()}`, 2) || c)).join('|')}|`;
    const format = `|${category.map(_ => ':-----:').join('|')}|`;
    const maxRows = category.reduce((acc, cur) => {
      const ct = state[cur] as CollectionType<IContent>;
      return ct && ct.list ? Math.max(acc, ct.list.length) : acc;
    }, 0);
    const content = range(maxRows)
      .map(
        index =>
          `|${category
            .map(c => {
              const ct = state[c] as CollectionType<IContent>;
              // return ct && ct.list && ct.list.length > index ? ct.list[index].name : ' ';
              return ct && ct.list && ct.list.length > index ? included(c, ct.list[index]) : '';
            })
            .join('|')}|`
      )
      .join('\n');

    const md = `
${headers}
${format}
${content}`;
    const html = render(md);

    function listener(e: ClipboardEvent) {
      if (!e.clipboardData) return;
      e.clipboardData.setData('text/html', htmlTemplate({ body: html, css: cssTable }));
      e.clipboardData.setData('text/plain', md);
      e.preventDefault();
    }
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
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
