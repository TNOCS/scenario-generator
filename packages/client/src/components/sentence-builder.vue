<template>
  <div>
    <v-card dense flat tile class="flex-card" style="background: transparent; overflow: auto">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.BUILD_SENTENCE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="">
          <v-btn @click="generateScenario" color="accent darken-1" elevation="2" class="d-flex ma-4">
            {{ $t("APP.GENERATE", { item: $tc("APP.SCENARIO") }) }}
          </v-btn>
          <div v-if="generated">
            <v-row v-for="catName in categoryNames" :key="catName" class="">
              <v-col xs="12">
                <v-card>
                  <v-card-title dense class="add-context-card">
                    {{ catName }}
                  </v-card-title>
                  <v-card-text class="pb-0">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left bold--text">Dimension</th>
                            <th class="text-left bold--text more-padding">Selected</th>
                          </tr>
                        </thead>
                        <tbody class="category-table">
                          <template>
                            <tr v-for="cat in categories[catName]" :key="cat">
                              <td>{{ cat }}</td>
                              <td class="more-padding">{{ getRandom(cat) }}</td>
                            </tr>
                          </template>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { ContentCategory, IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { CollectionsModel } from "../services/states/collection-state";
import { getUuid } from "../utils/constants";
import _ from "lodash";

@Component({
  components: {},
})
export default class SentenceBuilder extends Vue {
  private scenario?: Partial<IScenario> = {};
  private rows: Array<CollectionNames> = [];
  private collections: CollectionsModel<IContent> | null = null;
  private categoryNames: ContentCategory[] = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private generated: boolean = false;

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      this.scenario = s.scenarios.current;
      this.rows.length = 0;
      CollectionNamesArr.forEach((n) => {
        this.rows.push(n);
      });
      this.categories = this.scenario ? this.scenario!.categories! : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
      this.collections = s;
    });
  }

  private getCategoryRows(cat: ContentCategory): CollectionNames[] {
    return this.rows.filter((r) => this.categories[cat].includes(r));
  }

  private getRandom(cat: CollectionNames): string {
    if (this.collections[cat].list!.length <= 0) {
      return "None";
    } else {
      const r = _.random(this.collections[cat].list!.length - 1);
      return this.collections[cat].list![r].name!;
    }
  }

  private generateScenario() {
    console.log("generate");
    this.generated = !this.generated;
  }

  mounted() {
    console.log(`SentenceBuilder mounted`);
    this.init();
  }
}
</script>

<style lang="css">
.sentence-block {
  display: inline;
  font-size: 110%;
}
.sentence-block.main {
  font-weight: bold;
  margin-right: 4px;
}
.sentence-block.pre {
  margin-right: 4px;
}
.sentence-block.article {
  margin-right: 4px;
}
.sentence-block.suf {
  margin-right: 4px;
}
.sentence-col .v-input--selection-controls .v-input__slot > .v-label {
  display: inline;
}
.sentence-col .v-input--selection-controls {
  margin-top: 8px;
}
</style>
