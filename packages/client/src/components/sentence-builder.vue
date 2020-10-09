<template>
  <div>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.BUILD_SENTENCE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid>
          <v-row>
            <v-col xs="6" sm="2" v-for="b in blocks" :key="b.id">
              <div class="sentence-block pre">
                <v-icon>{{
                  b.id === "actors_demonstrate" ? "mdi-checkbox-blank-outline" : "mdi-checkbox-marked-outline"
                }}</v-icon>
              </div>
              <div class="sentence-block pre">{{ `${b.prefix} ` }}</div>
              <div class="sentence-block main">{{ `${getTranslateKey(b.blocktype)} ` }}</div>
              <div class="sentence-block suf">{{ `${b.suffix}` }}</div>
            </v-col>
          </v-row>
          <v-btn @click="addBlockSentence" color="accent darken-1" elevation="2" class="d-flex ma-4">
            {{ $t("APP.ADD", { item: $tc("APP.STRUCTURE") }) }}
          </v-btn>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr, TranslateKeys } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import ActiveScenario from "./active-scenario.vue";

@Component({
  components: { ActiveScenario },
})
export default class SentenceBuilder extends Vue {
  private blocks: Partial<IContent>[] = [];

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      Vue.set(this, "blocks", s.blocks.list!);
    });
  }

  private getTranslateKey(itemtype: CollectionNames) {
    return this.$tc(`COMP.${TranslateKeys[itemtype]}`);
  }

  private addBlockSentence() {
    const s: ISentence = {
      id: getUuid(),
      blockids: this.blocks.filter((b) => b.id !== "actors_demonstrate").map((b) => b.id!),
    };
    this.$store.actions.changeSentence(s);
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
}
.sentence-block.main {
  font-weight: bold;
  font-size: 120%;
}
.sentence-block.pre {
  font-size: 110%;
}
.sentence-block.suf {
  font-size: 110%;
}
</style>
