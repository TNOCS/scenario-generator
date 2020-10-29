<template>
  <div>
    <v-card dense flat tile class="flex-card generate-card" style="background: transparent; overflow: auto">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.GENERATE", { item: $tc("APP.SCENARIO") })}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid class="">
          <v-btn @click="generateScenario" color="accent darken-1" elevation="2" class="d-flex ma-4">
            {{ $t("APP.GENERATE", { item: $tc("APP.SCENARIO") }) }}
          </v-btn>
          <div>
            <v-row class="mt-1">
              <v-col v-for="catName in categoryNames" :key="catName" class="" xs="6" cols="6">
                <v-card>
                  <v-card-title dense>
                    {{ catName }}
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <v-simple-table dense v-if="collections">
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
                              <td class="catname">{{ cat }}</td>
                              <td class="py-1">
                                <!-- prettier-ignore -->
                                <v-select :items="collections[cat].list" item-text="name" item-value="id" v-model="answers[cat]"
                                  clearable solo dense hide-details></v-select>
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
          </div>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `2. ${$t("APP.WRITE_NARRATIVE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-textarea filled v-model="narrativeText" hint="Write a narrative "> </v-textarea>
      </v-card-text>
    </v-card>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `3. ${$t("APP.PIN", { item: $tc("APP.SCENARIO") })}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-text-field
          class="name-field"
          v-model="narrativeName"
          :label="$t('APP.NAME') | capitalize"
          append-outer-icon="mdi-content-save"
          @click:append-outer="pinNarrative"
          v-on:keyup.enter="pinNarrative"
        >
        </v-text-field>
      </v-card-text>
    </v-card>
    <v-row class="mt-1"> </v-row>
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
    this.answers = this.narrative.components || ({} as { [key in CollectionNames]: string });
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

  private generateScenario() {
    console.log("generate");
    for (const c in this.categories) {
      const names: CollectionNames[] = this.categories[c as ContentCategory];
      for (const n in names) {
        const name = names[n];
        Vue.set(this.answers, name, this.getRandom(name));
      }
    }
    this.generated = !this.generated;
  }

  private async pinNarrative() {
    console.log("Pin narrative");
    if (!this.scenario) return;
    if (!this.scenario.narratives) {
      this.scenario.narratives = [];
    } else {
      this.scenario.narratives = this.scenario.narratives.filter(n => n.id != this.narrativeName);
    }
    const n: INarrative = {
      id: this.narrativeName,
      name: this.narrativeName,
      components: this.answers,
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
</style>
