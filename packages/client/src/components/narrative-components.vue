<template>
  <v-card flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">
      {{ `${$tc("APP.DIMENSION", 2)}` }}
      <span style="float: right">
        <v-btn icon><v-icon>mdi-info</v-icon></v-btn>
      </span>
    </div>
    <v-divider />
    <v-card-text class="text-description">
      <div v-if="scenario && narrative.components" class="narr-table">
        <v-simple-table dense v-for="cat in categoryNames" :key="cat" class="mb-2">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left bold--text normal-font">{{ cat }}</th>
              </tr>
              <tr>
                <th class="text-left" v-for="col in getCollectionNames(cat)" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(id, col) in getNarrativeComponents(cat)" :key="id">
                  <div>{{ getCollectionVal(id, col) }}</div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ContentCategory, IContent, INarrative, IScenario } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { CollectionsModel } from "../services/states/collection-state";
import { getUuid } from "../utils/constants";
import _ from "lodash";

@Component({
  components: {},
})
export default class NarrativeComponents extends Vue {
  private scenario?: Partial<IScenario> = {};
  private narrative: INarrative = {} as INarrative;
  private collections: CollectionsModel<IContent> | null = null;
  private categoryNames: ContentCategory[] = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current;
      this.narrative = s.app.narrative;
      this.categories = this.scenario ? this.scenario!.categories! : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
      this.collections = s;
    });
  }

  private getNarrativeComponents(cat: ContentCategory): any {
    const names = CollectionNamesArr.filter(r => this.categories[cat].includes(r));
    return _.pickBy(this.narrative.components, (val, key) => names.includes(key as any));
  }

  private getCollectionVal(id: string, col: CollectionNames): string {
    const item: Partial<IContent> | undefined = this.collections![col]!.list!.find(l => l.id! === id);
    return item ? item.name! : "?";
  }

  private getCollectionNames(cat: ContentCategory): CollectionNames[] {
    return CollectionNamesArr.filter(r => this.categories[cat].includes(r));
  }

  mounted() {
    this.init();
  }
}
</script>

<style scoped lang="css">
.normal-font {
  font-size: initial !important;
}
.narr-table .v-data-table--dense > .v-data-table__wrapper > table > thead > tr > th,
.narr-table .v-data-table--dense > .v-data-table__wrapper > table > tbody > tr > td {
  overflow: hidden;
  width: 100px;
}
.narr-table .v-data-table--dense > .v-data-table__wrapper > table > tbody > tr > td > div {
  width: 100px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
