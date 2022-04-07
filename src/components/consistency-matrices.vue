<template>
  <div class="full-height">
    <v-tabs v-model="tab" @change="tabChanged">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab v-for="catName in categoryNames" :key="catName">
        {{ catName }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="full-height">
      <v-tab-item v-for="(val, cat) in categories" :key="cat" class="full-height">
        <v-card dense flat tile class="flex-card full-height" style="background: transparent">
          <v-card-text class="text-description ma-0 pa-2 full-height">
            <v-container fluid class="ma-0 pa-0 full-height">
              <v-row no-gutters>
                <v-col xs="12" md="8" class="d-flex">
                  <!-- <span>{{ $t("APP.SELECT_DIMENSION") | capitalize }}</span> -->
                  <span class="title pt-4">
                    <!-- {{ $t("APP.CONSISTENCIES") }} -->
                    {{ $t('APP.COMBINE') | capitalize }}
                  </span>
                  <span class="ml-8 mb-2">
                    <v-select
                      :label="$t('APP.SELECT_DIMENSION') | capitalize"
                      :items="getCategoryRowsMap(cat)"
                      v-model="selectedCategory2"
                      class="sel-dim"
                    >
                    </v-select>
                  </span>
                  <span class="title pt-4">{{ $t('APP.AND') }}</span>
                  <span class="ml-8 mb-2">
                    <v-select
                      :label="$t('APP.SELECT_DIMENSION2') | capitalize"
                      :items="getCategoryRowsMap(cat)"
                      v-model="selectedCategory"
                      class="sel-dim"
                    >
                    </v-select>
                  </span>
                </v-col>
                <v-col xs="12" md="4" class="d-flex">
                  <v-card class="mx-auto pa-2">
                    <span class="d-block"><v-icon class="pr-1">mdi-checkbox-marked</v-icon>{{ $t('APP.CONSISTENT') }}</span>
                    <span class="d-block"
                      ><v-icon class="pr-1">mdi-checkbox-blank-outline</v-icon>{{ $t('APP.INCONSISTENT') }}</span
                    >
                    <span class="d-block"><v-icon class="pr-1">mdi-checkerboard</v-icon>{{ $t('APP.PARTLY_CONSISTENT') }} </span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="scenario" class="full-height-min-select">
                <TableCard
                  :category="selectedCategory"
                  :category2="selectedCategory2"
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ContentCategory, IScenario } from '../models';
import { CollectionNames, CollectionNamesArr } from '../services/meiosis';
import { translateCollName } from '../i18n';
import TableCard from './table-card.vue';

@Component({
  components: { TableCard },
})
export default class ConsistencyMatrices extends Vue {
  private tab = 0;
  private scenario: Partial<IScenario> = {};
  private rows: Array<CollectionNames> = [];
  private categories: { [key in ContentCategory]: Array<CollectionNames> } = {} as {
    [key in ContentCategory]: Array<CollectionNames>;
  };
  private categoryNames: ContentCategory[] = [];
  private selectedCategory: CollectionNames | null = null;
  private selectedCategory2: CollectionNames | null = null;

  constructor() {
    super();
  }

  @Watch('scenario.inconsistencies')
  private inconsistenciesChanged() {
    this.$store.actions['scenarios'].save(this.scenario);
  }

  private tabChanged(newTab: number) {
    console.log(newTab);
    this.selectedCategory = Object.values(this.categories)[newTab][0];
  }

  private getCategoryRows(cat: ContentCategory): CollectionNames[] {
    return this.rows.filter(r => this.categories[cat].includes(r));
  }

  private getCategoryRowsMap(cat: ContentCategory): any[] {
    return this.getCategoryRows(cat).map(c => ({ text: translateCollName(c), value: c }));
  }

  private async init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current || this.scenario;
      if (this.scenario && !this.scenario.inconsistencies) this.scenario.inconsistencies = [];
      this.rows.length = 0;
      CollectionNamesArr.forEach(n => {
        this.rows.push(n);
      });
      this.categories =
        this.scenario && this.scenario.categories
          ? this.scenario.categories
          : ({} as { [key in ContentCategory]: Array<CollectionNames> });
      this.selectedCategory = this.selectedCategory ? this.selectedCategory : this.rows.length > 0 ? this.rows[0] : null;
      this.categoryNames = Object.keys(this.categories || []) as ContentCategory[];
    });
  }

  async mounted(): Promise<void> {
    console.log(`ConsistencyMatrices mounted`);
    await this.init();
  }
}
</script>

<style lang="css">
.scenario-sentence {
  display: inline;
  font-size: 150%;
  padding-right: 6px;
}
.text-description.full-height {
  height: calc(100% - 32px);
}
.full-height-min-tab {
  height: calc(100% - 48px);
}
.full-height-min-select {
  height: calc(100% - 32px);
}
.v-tabs-items.v-window.full-height {
  height: calc(100% - 48px);
}
.sel-dim {
  max-width: 400px;
}
</style>
