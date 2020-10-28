<template>
  <v-card dense flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">{{ `2. ${$t("APP.WRITE_NARRATIVE")}` }}</div>
    <v-card-text class="text-description ma-0 pa-1">
      <v-textarea filled v-model="scenariotext" :hint="`${$t('APP.WRITE_NARRATIVE')}`"> </v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import ScenarioText from "../components/scenario-text.vue";

@Component({
  components: { ScenarioText },
})
export default class ScenarioBuilder extends Vue {
  private columns: Record<CollectionNames, Partial<IContent>[]> = {} as Record<CollectionNames, Partial<IContent>[]>;
  private answers: Record<string, string> = {} as Record<string, string>;
  private scenario?: Partial<IScenario> = {};
  private scenariotext: string = "";

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
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current;
      const columns = {} as Record<CollectionNames, Partial<IContent>[]>;
      CollectionNamesArr.forEach(n => {
        columns[n] = s[n].list!;
      });
      Vue.set(this, "columns", columns);
    });
  }

  private getTranslateKey(itemtype: CollectionNames) {
    return this.$tc(`COMP.${itemtype.toLocaleUpperCase()}`);
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
