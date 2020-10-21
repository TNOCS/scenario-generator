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
                <span class="build-block pre" v-if="b.prefix && b.prefix.length > 0">{{ $t(b.prefix) }}</span>
                <span class="build-block article" v-if="b.indefinite">
                  {{ answers.hasOwnProperty(b.id) ? answers[b.id] : getTranslateKey(b.blocktype) | getArticle }}
                </span>
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns[b.blocktype]"
                  v-model="answers[b.id]"
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
          <!-- <div style="margin-left: -8px" class="overline py-4">{{ `3. Scenario` }}</div> -->
          <!-- <div v-if="scenario && scenario.sentences">
            <div v-for="(se, idx) in scenario.sentences" :key="idx">{{ se | capitalize }}</div>
          </div> -->
          <div style="margin-left: -16px">
            <ScenarioText />
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
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import {  getUuid } from "../utils/constants";
import ScenarioText from "../components/scenario-text.vue";

@Component({
  components: { ScenarioText },
})
export default class ScenarioBuilder extends Vue {
  private columns: Record<CollectionNames, Partial<IContent>[]> = {} as Record<CollectionNames, Partial<IContent>[]>;
  private answers: Record<string, string> = {} as Record<string, string>;
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
      const columns = {} as Record<CollectionNames, Partial<IContent>[]>;
      CollectionNamesArr.forEach((n) => {
        columns[n] = s[n].list!;
      });
      Vue.set(this, "columns", columns);
    });
  }

  private getTranslateKey(itemtype: CollectionNames) {
    return this.$tc(`COMP.${itemtype.toLocaleUpperCase()}`);
  }

  private async addSentence() {
    if (!this.scenario) {
      alert(`Select a scenario first, by clicking a card in the "Add components" view!`);
      return;
    }
    const result = this.sentenceblocks.reduce((prev, cur, curInd) => {
      const parts: string[] = [prev];
      parts.push(cur.prefix);
      parts.push(cur.indefinite ? this.$options.filters!.getArticle(this.answers[cur.id]) : "");
      parts.push(this.answers[cur.id]);
      parts.push(cur.suffix);
      return `${parts.filter((p) => p && p.length > 0).join(" ")}`;
    }, "");
    this.$store.actions.scenarios.save(this.scenario);
    // this.$store.actions.changeSelectedBlocks([]);
    this.$store.actions.changeSentence({ id: getUuid(), blockids: [] });
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
  font-weight: bold;
  margin-left: 6px;
}
.nat-lang-form {
  font-size: 150%;
}
.build-block {
  display: inline;
}
.build-block.article {
}
</style>
