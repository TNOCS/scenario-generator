<template>
  <div>
    <ActiveScenario />
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ $tc("APP.SENTENCE", 2) }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <div v-if="scenario && scenario.sentences">
          <div v-for="se in scenario.sentences" :key="se">
            {{ se }}
          </div>
        </div>
        <v-form v-model="valid" class="nat-lang-form" autocomplete="off">
          <v-container fluid>
            <v-row>
              <v-col cols="12" class="flex-shrink-1"></v-col>
              <v-col>
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns['actors']"
                  v-model="actor"
                  dense
                  single-line
                  :rules="nameRules"
                  :label="$tc('COMP.ACTOR', 1)"
                  required
                ></v-select>
                attacks an object in
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns['locations']"
                  v-model="location"
                  dense
                  single-line
                  :rules="nameRules"
                  :label="$tc('COMP.LOCATION')"
                  required
                ></v-select>
                with an
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns['weapons']"
                  v-model="weapon"
                  dense
                  single-line
                  :rules="nameRules"
                  :label="$tc('COMP.WEAPON')"
                  required
                ></v-select>
                for
                <v-select
                  class="d-inline-flex flex-shrink-1 nat-lang-select"
                  item-value="name"
                  item-text="name"
                  :items="columns['motivations']"
                  v-model="motivation"
                  dense
                  single-line
                  :rules="nameRules"
                  :label="$tc('COMP.MOTIVATION')"
                ></v-select>
                reasons.
              </v-col>
              <v-col cols="1" class="flex-grow-1"></v-col>
            </v-row>
            <v-btn @click="addSentence" color="accent darken-1" elevation="2" class="d-flex ma-4">
              {{ $t("SUBMIT") }}
            </v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, IScenario } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import ActiveScenario from "./active-scenario.vue";

@Component({
  components: { ActiveScenario },
})
export default class ScenarioBuilder extends Vue {
  private columns: Record<CollectionNames, Partial<IContent>[]> = {} as Record<CollectionNames, Partial<IContent>[]>;
  private actor: string = "";
  private location: string = "";
  private motivation: string = "";
  private weapon: string = "";
  private scenario?: Partial<IScenario>;

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
      const columns = {} as Record<CollectionNames, Partial<IContent>[]>;
      CollectionNamesArr.forEach((n) => {
        columns[n] = s[n].list!;
      });
      Vue.set(this, "columns", columns);
    });
  }

  private async addSentence() {
    if (!this.scenario) return;
    if (!this.scenario.sentences) this.scenario.sentences = [];
    this.scenario.sentences.push(
      `${this.actor} attacks an object in ${this.location} with an ${this.weapon} for ${this.motivation} reasons.`
    );
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
</style>
