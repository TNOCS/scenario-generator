<template>
  <div>
    <v-tabs v-model="tab" @change="tabChanged">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab v-for="catName in categoryNames" :key="catName">
        {{ catName }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(val, cat) in categories" :key="cat">
        <v-card dense flat tile class="flex-card" style="background: transparent">
          <div class="overline px-2 py-0">{{ $tc("APP.COMPONENT", 2) }}</div>
          <v-card-text class="text-description ma-0 pa-2">
            <v-container fluid class="ma-0 pa-0">
              <v-row no-gutters>
                <v-col xs="12" md="6" class="">
                  <span>{{ $t("APP.SELECT_DIMENSION") | capitalize }}</span>
                  <span>
                    <v-select :items="getCategoryRows(cat)" v-model="selectedCategory"> </v-select>
                  </span>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="scenario">
                <TableCard
                  :category="selectedCategory"
                  :othercategories="getCategoryRows(cat)"
                  :inconsistencies="scenario.inconsistencies"
                />
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { ContentCategory, IBlock, IContent, IScenario, ISentence } from "../models";
import { CollectionNames, CollectionNamesArr } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import TableCard from "../components/table-card.vue";

@Component({
  components: { TableCard },
})
export default class ConsistencyMatrices extends Vue {
  private tab: number = 0;
  private scenario?: Partial<IScenario> = {};
  private rows: Array<CollectionNames> = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private categoryNames: ContentCategory[] = [];
  private selectedCategory: CollectionNames | null = null;

  constructor() {
    super();
  }

  private tabChanged(newTab: number) {
    console.log(newTab);
    this.selectedCategory = Object.values(this.categories)[newTab][0];
  }

  private getCategoryRows(cat: ContentCategory): CollectionNames[] {
    return this.rows.filter((r) => this.categories[cat].includes(r));
  }

  private async init() {
    this.$store.states.map((s) => {
      this.scenario = s.scenarios.current;
      if (this.scenario && !this.scenario.inconsistencies) this.scenario.inconsistencies = [];
      this.rows.length = 0;
      CollectionNamesArr.forEach((n) => {
        this.rows.push(n);
      });
      this.categories = this.scenario ? this.scenario!.categories! : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.selectedCategory = this.selectedCategory ? this.selectedCategory : this.rows.length > 0 ? this.rows[0] : null;
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
    });
  }

  mounted() {
    console.log(`ConsistencyMatrices mounted`);
    this.init();
  }
}
</script>

<style lang="css">
.scenario-sentence {
  display: inline;
  font-size: 150%;
  padding-right: 6px;
}
</style>
