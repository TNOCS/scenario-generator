<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">{{ `2. ${$t("APP.FILL_SENTENCE")}` }}</div>
    <v-card-text class="text-description ma-0 pa-1">
      <v-form v-model="valid" class="nat-lang-form" autocomplete="off">
        <v-container fluid>
          <v-row>
            <v-col cols="12" class="flex-shrink-1"></v-col>
            <v-col>
              <div class="build-block" v-for="b in sentenceblocks" :key="b.id">
                {{ b.prefix }}
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns[b.blocktype]"
                  v-model="answers[b.blocktype]"
                  dense
                  single-line
                  :rules="nameRules"
                  :label="getTranslateKey(b.blocktype)"
                  required
                ></v-select>
                {{ b.suffix }}
              </div>
            </v-col>
            <v-col cols="1" class="flex-grow-1"></v-col>
          </v-row>
          <v-btn @click="addSentence" color="accent darken-1" elevation="2" class="d-flex ma-4">
            {{ $t("APP.ADD", { item: $tc("APP.SENTENCE") }) }}
          </v-btn>
          <div style="margin-left: -8px" class="overline py-4">{{ `3. Scenario` }}</div>
          <div v-if="scenario && scenario.sentences">
            <div v-for="se in scenario.sentences" :key="se">
              {{ se }}
            </div>
          </div>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IBlock, IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr, TranslateKeys } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class ScenarioBuilder extends Vue {
  private columns: Record<CollectionNames, Partial<IContent>[]> = {} as Record<CollectionNames, Partial<IContent>[]>;
  private answers: Record<CollectionNames, string> = {} as Record<CollectionNames, string>;
  private scenario?: Partial<IScenario> = {};
  private sentence: ISentence = {} as ISentence;
  private sentenceblocks: IBlock[] = [];

  private valid: boolean = true;
  private nameRules = [
    (v: string) => {
      return (v && v.length > 0) || "Empty name forbidden";
    },
  ];

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      this.scenario = s.scenarios.current;
      Vue.set(this, "sentence", s.app.sentence);
      Vue.set(
        this,
        "sentenceblocks",
        s.app.sentence.blockids.map((id) => s["blocks"].list!.find((b) => b.id === id))
      );
      const columns = {} as Record<CollectionNames, Partial<IContent>[]>;
      CollectionNamesArr.forEach((n) => {
        columns[n] = s[n].list!;
      });
      Vue.set(this, "columns", columns);
    });
  }

  private getTranslateKey(itemtype: CollectionNames) {
    return this.$tc(`COMP.${TranslateKeys[itemtype]}`);
  }

  private async addSentence() {
    if (!this.scenario) {
      alert(`Select a scenario first, by clicking a card in the "Add components" view!`);
      return;
    }
    if (!this.scenario.sentences) this.scenario.sentences = [];
    const result = this.sentenceblocks.reduce((prev, cur, curInd) => {
      return `${prev} ${cur.prefix} ${this.answers[cur.blocktype]} ${cur.suffix}`;
    }, "");
    this.scenario.sentences.push(result);
    this.$store.actions.scenarios.save(this.scenario);
  }

  mounted() {
    console.log(`ScenarioBuilder mounted`);
    this.init();
  }
}
</script>

<style lang="css">
.nat-lang-form .v-select .v-select__slot .v-select__selection--comma {
  min-width: min-content;
}
.nat-lang-select.v-input--is-dirty input {
  width: 0;
}
.nat-lang-select.v-input--is-dirty .v-input__append-inner {
  display: none;
}
.nat-lang-select {
  min-width: min-content;
}
.nat-lang-select {
  font-weight: bold;
}
.nat-lang-form {
  font-size: 150%;
}
.build-block {
  display: inline;
}
</style>
