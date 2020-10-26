<template>
  <div>
    <v-card dense flat tile class="flex-card" style="background: transparent; overflow: auto">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.GENERATE", { item: $tc("APP.SCENARIO") })}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="">
          <v-btn @click="generateScenario" color="accent darken-1" elevation="2" class="d-flex ma-4">
            {{ $t("APP.GENERATE", { item: $tc("APP.SCENARIO") }) }}
          </v-btn>
          <div v-if="generated">
            <v-row class="mt-1">
              <v-col v-for="catName in categoryNames" :key="catName" class="" xs="6">
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
                              <td class="more-padding">{{ answers[cat] }}</td>
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
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `2. ${$t("APP.WRITE_NARRATIVE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-textarea filled v-model="scenariotext" hint="Write a narrative "> </v-textarea>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `3. ${$t("APP.PIN", { item: $tc("APP.SCENARIO") })}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-btn @click="pinScenario" color="accent darken-1" elevation="2" class="d-flex ma-4">
          {{ $t("APP.PIN", { item: $tc("APP.SCENARIO") }) }}
        </v-btn>
      </v-card-text>
    </v-card>
    <v-row class="mt-1"> </v-row>
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
export default class ScenarioGenerator extends Vue {
  private scenario?: Partial<IScenario> = {};
  private scenariotext: string = "";
  private rows: Array<CollectionNames> = [];
  private collections: CollectionsModel<IContent> | null = null;
  private categoryNames: ContentCategory[] = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private answers: { [key in CollectionNames]: string } = {} as { [key in CollectionNames]: string };
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
    if (!this.collections || this.collections[cat].list!.length <= 0) {
      return "None";
    } else {
      const r = _.random(this.collections[cat].list!.length - 1);
      return this.collections[cat].list![r].name!;
    }
  }

  private generateScenario() {
    console.log("generate");
    for (const c in this.categories) {
      const names: CollectionNames[] = this.categories[c as ContentCategory];
      for (const n in names) {
        const name = names[n];
        this.answers[name] = this.getRandom(name);
      }
    }
    this.generated = !this.generated;
  }

  private pinScenario() {
    console.log("pin");
    if (!this.scenario) return;
    if (!this.scenario.narratives) this.scenario.narratives = [];
    this.scenario.narratives.length = 0;
    this.scenario.narratives!.push({
      name: `${Date.now()}`,
      components: this.answers,
      narrative: this.scenariotext,
    });
  }

  mounted() {
    console.log(`ScenarioGenerator mounted`);
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
