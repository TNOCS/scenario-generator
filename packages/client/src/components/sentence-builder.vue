<template>
  <div>
    <v-card dense flat tile class="flex-card" style="background: transparent">
      <div class="overline px-2 py-0">{{ `1. ${$t("APP.BUILD_SENTENCE")}` }}</div>
      <v-card-text class="text-description ma-0 pa-1">
        <v-container fluid>
          <v-row>
            <v-col xs="6" sm="2" v-for="b in blocks" :key="b.id" class="sentence-col pl-2 py-0">
              <v-checkbox dense hide-details v-model="selectedBlockIds" :value="b.id">
                <template v-slot:label class="inline-label">
                  <span class="sentence-block pre" v-if="b.prefix && b.prefix.length > 0">{{ b.prefix }}</span>
                  <span class="sentence-block article" v-if="b.indefinite">
                    {{ getTranslateKey(b.blocktype) | getArticle | trim }}
                  </span>
                  <span class="sentence-block main">{{ getTranslateKey(b.blocktype) }}</span>
                  <span class="sentence-block suf" v-if="b.suffix && b.suffix.length > 0">{{ b.suffix }}</span>
                </template>
              </v-checkbox>
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
  private selectedBlockIds: string[] = [];

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s) => {
      Vue.set(this, "blocks", s.blocks.list!);
      Vue.set(this, "selectedBlockIds", s.app.selectedBlocks);
    });
  }

  private getTranslateKey(itemtype: CollectionNames) {
    return this.$tc(`COMP.${TranslateKeys[itemtype]}`);
  }

  private addBlockSentence() {
    const s: ISentence = {
      id: getUuid(),
      blockids: this.selectedBlockIds,
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
.sentence-col .v-input--selection-controls .v-input__slot>.v-label {
  display: inline;
}
</style>
