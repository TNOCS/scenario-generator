<template>
  <div>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.WRITE_NARRATIVE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-text-field
          hide-details
          class="name-field pb-2"
          :label="$t('APP.TITLE') | capitalize"
          v-model="narrativeName"
          v-on:keyup.enter="saveNarrative"
          v-on:blur="saveNarrative"
        >
        </v-text-field>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <v-card-text class="text-description ma-0 pa-1">
        <v-textarea filled v-model="narrativeText" :hint="$tc('COMP.NARRATIVE') | capitalize"> </v-textarea>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card generate-card" style="background: transparent; overflow: auto">
      <div class="overline px-2 py-0">{{ `2. ${$t("APP.GENERATE", { item: $tc("APP.SCENARIO") })}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="pa-0 ma-0">
          <v-row no-gutters class="d-flex">
            <v-btn @click="generateNarrative" color="accent darken-1" elevation="2" class="d-flex ma-4">
              {{ $t("APP.GENERATE", { item: $tc("APP.SCENARIO") }) }}
            </v-btn>
            <v-btn @click="newNarrative" color="accent darken-1" elevation="2" class="d-flex ma-4">
              {{ $t("APP.EMPTY", { item: $tc("APP.SCENARIO") }) }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="saveNarrative" color="accent darken-1" elevation="2" class="d-flex ma-4 ml-8 btn-right">
              <v-icon class="pr-2">mdi-content-save</v-icon>
              {{ $t("APP.PIN", { item: $tc("APP.SCENARIO") }) }}
            </v-btn>
          </v-row>
          <v-row class="mt-1 full-width" no-gutters>
            <v-col v-for="catName in categoryNames" :key="catName" class="pl-2" xs="6" cols="6">
              <v-card>
                <v-card-title dense>
                  {{ catName }}
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-simple-table dense v-if="collections">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left bold--text small-col">
                            <v-tooltip right open-delay="1000">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon v-on="on" v-bind="attrs" small @click="toggleNeglected()"> mdi-eye-check </v-icon>
                              </template>
                              <span>{{ $t("APP.INCLUDE_ALL") | capitalize }}</span>
                            </v-tooltip>
                          </th>
                          <th class="text-left bold--text">Dimension</th>
                          <th class="text-left bold--text more-padding">
                            <span> Selected</span>
                            <span class="close-icon-span">
                              <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon v-on="on" v-bind="attrs" small> mdi-close </v-icon>
                                </template>
                                <span> {{ $t("APP.EXPLAIN_CLEAR_ICON") }}</span>
                              </v-tooltip>
                            </span>
                          </th>
                          <th class="text-left bold--text small-col pr-8">
                            <v-tooltip right open-delay="1000">
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon v-on="on" v-bind="attrs" small @click="togglePinned()"> mdi-lock-open-outline </v-icon>
                              </template>
                              <span>{{ $t("APP.UNLOCK_ALL") | capitalize }}</span>
                            </v-tooltip>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="category-table">
                        <template>
                          <tr
                            v-for="cat in categories[catName]"
                            :key="cat"
                            :class="{ 'neglected-cat': neglected.includes(cat), 'pinned-cat': pinned.includes(cat) }"
                          >
                            <td class="small-col">
                              <v-tooltip right open-delay="1000">
                                <template v-slot:activator="{ on, attrs }">
                                  <span v-on="on" v-bind="attrs">
                                    <v-icon v-if="neglected.includes(cat)" small @click="toggleNeglected(cat)">
                                      mdi-eye-off-outline
                                    </v-icon>
                                    <v-icon v-else small @click="toggleNeglected(cat)">mdi-eye-outline</v-icon>
                                  </span>
                                </template>
                                <span>{{ $t("APP.DIMENSION_INCLUDED") | capitalize }}</span>
                              </v-tooltip>
                            </td>
                            <td class="catname">{{ cat | translateCollectionName | capitalize }}</td>
                            <td class="py-1 combobox">
                              <!-- prettier-ignore -->
                              <v-select :items="collections[cat].list" item-text="name" item-value="id" v-model="answers[cat]"
                                  clearable solo dense hide-details v-show="!neglected.includes(cat)">
                                </v-select>
                              <div class="pl-4" v-show="neglected.includes(cat)">-</div>
                            </td>
                            <td class="small-col pr-8">
                              <v-tooltip right open-delay="1000">
                                <template v-slot:activator="{ on, attrs }">
                                  <span v-on="on" v-bind="attrs">
                                    <v-icon v-if="pinned.includes(cat)" small @click="togglePinned(cat)">
                                      mdi-lock-outline
                                    </v-icon>
                                    <v-icon v-else small @click="togglePinned(cat)">mdi-lock-open-variant-outline</v-icon>
                                  </span>
                                </template>
                                <span>{{ $t("APP.UNLOCK_ONE") | capitalize }}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <v-card-text class="text-description ma-0 pa-1">
        <div class="d-flex">
          <v-btn @click="saveNarrative" color="accent darken-1" elevation="2" class="d-flex ma-2 ml-0">
            <v-icon class="pr-2">mdi-content-save</v-icon>
            {{ $t("APP.PIN", { item: $tc("APP.SCENARIO") }) }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-row class="mt-8"> </v-row>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { ContentCategory, IContent, INarrative, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { CollectionsModel } from "../services/states/collection-state";
import { getUuid } from "../utils/constants";
import _ from "lodash";

const MAX_GENERATIONS = 500;

@Component({
  components: {},
})
export default class ScenarioGenerator extends Vue {
  private scenario?: Partial<IScenario> = {};
  private rows: Array<CollectionNames> = [];
  private collections: CollectionsModel<IContent> | null = null;
  private categoryNames: ContentCategory[] = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private answers: { [key in CollectionNames]: string } = {} as { [key in CollectionNames]: string };
  private neglected: CollectionNames[] = [];
  private pinned: CollectionNames[] = [];
  private generated: boolean = false;
  private narrativeName: string = "";
  private narrativeText: string = "";
  private narrative: INarrative = {} as INarrative;

  @Watch("narrative")
  private narrativeChanged(nar: INarrative) {
    if (!nar) return;
    console.log(`narrativeChanged to ${nar.id}`);
    this.narrativeName = nar.name || "";
    this.narrativeText = nar.narrative || "";
    if (!nar.components) nar.components = {} as { [key in CollectionNames]: string };
    this.answers = Object.assign({}, nar.components);
    this.pinned = Object.keys(this.answers) as CollectionNames[];
  }

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current;
      this.rows.length = 0;
      CollectionNamesArr.forEach(n => {
        this.rows.push(n);
      });
      this.categories = this.scenario ? this.scenario!.categories! : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
      this.collections = s;
      this.narrative = s.app.narrative;
    });
  }

  private getCategoryRows(cat: ContentCategory): CollectionNames[] {
    return this.rows.filter(r => this.categories[cat].includes(r));
  }

  private getRandom(cat: CollectionNames): string {
    if (!this.collections || this.collections[cat].list!.length <= 0) {
      return "None";
    } else {
      const r = _.random(this.collections[cat].list!.length - 1);
      return this.collections[cat].list![r].id!;
    }
  }

  private newNarrative() {
    this.narrativeText = "";
    this.answers = {} as { [key in CollectionNames]: string };
    this.neglected.length = 0;
    this.pinned.length = 0;
  }

  private togglePinned(cat?: CollectionNames) {
    if (!cat) {
      // All
      if (this.pinned.length > 0) {
        this.pinned.splice(0, this.pinned.length);
      } else {
        this.pinned.splice(0, this.pinned.length);
        this.rows.forEach(r => this.pinned.push(r));
      }
    } else {
      // Single
      const idx = this.pinned.indexOf(cat);
      if (idx >= 0) {
        this.pinned.splice(idx, 1);
      } else {
        this.pinned.push(cat);
      }
    }
  }

  private toggleNeglected(cat?: CollectionNames) {
    if (!cat) {
      this.neglected.length = 0;
    } else {
      const idx = this.neglected.indexOf(cat);
      if (idx >= 0) {
        this.neglected.splice(idx, 1);
      } else {
        this.neglected.push(cat);
        Vue.delete(this.answers, cat);
      }
    }
  }

  private generateNarrative() {
    console.log("generate");
    let narrativeValid = false;
    let count = 0;
    while (!narrativeValid && count < MAX_GENERATIONS) {
      count += 1;
      for (const c in this.categories) {
        const names: CollectionNames[] = this.categories[c as ContentCategory];
        for (const n in names) {
          const name = names[n];
          if (!this.neglected.includes(name) && !this.pinned.includes(name)) {
            Vue.set(this.answers, name, this.getRandom(name));
          }
        }
      }
      narrativeValid = this.isScenarioValid();
      if (narrativeValid) {
        console.log(`Valid scenario generated in iteration ${count}`);
      } else if (count == MAX_GENERATIONS) {
        console.log(`No valid scenario generated after ${count} iterations. Giving up...`);
        this.$store.actions.notify(this.$t(`APP.NO_VALID_SCENARIO`, { count: count }).toString());
        this.answers = {} as { [key in CollectionNames]: string };
      }
    }
    this.generated = !this.generated;
  }

  private isScenarioValid(): boolean {
    const inconsistencies = this.scenario!.inconsistencies || [];
    const answerIds = Object.values(this.answers).filter(a => !!a);
    const inconsistenciesFound = inconsistencies.filter(i => answerIds.includes(i.ids[0]) && answerIds.includes(i.ids[1]));
    // Always invalidate totally incompatible combinations, and invalidate 50% of partly incompatible combinations.
    const finalInconsistencyFound = inconsistenciesFound.some(
      i => i.type === "totally" || (i.type === "partly" && Math.random() < 0.5)
    );
    return !finalInconsistencyFound;
  }

  private async saveNarrative() {
    console.log("Pin narrative");
    if (!this.scenario) return;
    if (!this.scenario.narratives) {
      this.scenario.narratives = [];
    } else {
      this.scenario.narratives = this.scenario.narratives.filter(n => n.id != this.narrativeName);
    }
    let temp = {} as { [key in CollectionNames]: any };
    let answerObject = CollectionNamesArr.reduce((prev, cur) => ((prev[cur] = undefined), prev), temp);
    answerObject = Object.assign(answerObject, this.answers);
    const n: INarrative = {
      id: this.narrativeName,
      name: this.narrativeName,
      components: answerObject as { [key in CollectionNames]: string },
      narrative: this.narrativeText,
    };
    this.scenario.narratives!.push(n);
    await this.$store.actions["scenarios"].save(this.scenario);
    await this.$store.actions["scenarios"].load(this.scenario!.id!);
    await this.$store.actions.changeNarrative(n);
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
.name-field {
  max-width: 300px;
}
.generate-card,
.generate-card .v-data-table__wrapper,
.generate-card thead,
.generate-card tbody {
  max-width: 100%;
}
.generate-card table {
  table-layout: fixed;
  width: 100%;
}
.v-data-table > .v-data-table__wrapper > table > tbody.category-table > tr > td {
  padding: 4px 0px 4px 16px;
}
.small-col {
  width: 14px !important;
}
.combobox .mdi-close:hover {
  /* font-size: 2rem; */
}
.close-icon-span {
  float: right;
  margin-right: 28px;
}
.v-data-table--dense > .v-data-table__wrapper > table > tbody.category-table > tr.neglected-cat > td,
.v-data-table--dense > .v-data-table__wrapper > table > tbody.category-table > tr.neglected-cat > th {
  max-height: 24px;
  height: 24px;
  opacity: 0.5;
}
.v-data-table--dense > .v-data-table__wrapper > table > tbody.category-table > tr.pinned-cat,
table > tbody.category-table > tr.pinned-cat > .combobox > .v-input > .v-input__control > .v-input__slot {
  background: rgba(128, 128, 128, 0.1);
}
</style>
