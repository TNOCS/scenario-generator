<template>
  <v-row class="mt-0" no-gutters>
    <v-col v-for="catName in categoryNames" :key="catName" class="" xs="6" cols="6">
      <div class="overline pl-2 pr-2 pb-0 pt-1">
        {{ catName }}
      </div>
      <v-card class="no-background">
        <v-card-text class="pa-0">
          <div v-if="scenario && narrative.components" class="narr-table">
            <v-simple-table dense class="mb-2 mr-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left bold--text">{{ $tc("APP.DIMENSION") | capitalize }}</th>
                    <th class="text-left bold--text more-padding">{{ $t("APP.SELECTED") | capitalize }}</th>
                  </tr>
                </thead>
                <tbody class="category-table">
                  <template>
                    <tr v-for="(id, col) in getNarrativeComponents(catName)" :key="id">
                      <td class="catname">{{ col | translateCollectionName | capitalize }}</td>
                      <td>
                        <v-tooltip right open-delay="200">
                          <template v-slot:activator="{ on }">
                            <div v-on="on">{{ getCollectionVal(id, col) }}</div>
                          </template>
                          <span>{{ getCollectionVal(id, col) }}</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
export default class NarrativeComponentsVert extends Vue {
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
.nc-height {
  height: 320px;
}
</style>
