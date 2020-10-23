<template>
  <v-card class="full-width">
    <v-card-title dense class="table-card">
      {{ $t("APP.CONSISTENCIES") }}
    </v-card-title>
    <v-card-text class="pa-0 full-width">
      <v-container fluid class="ma-0 pa-0">
        <v-row no-gutters>
          <v-col>
            <v-simple-table dense class="consistency-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <td class="text-left bold--text">Dimension</td>
                    <td class="text-left bold--text">Name</td>
                    <td class="text-left" v-for="item in items" :key="item.id">{{ item.name }}</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="cat in otherCategoriesWithoutSelected()">
                    <tr v-for="content in collections[cat].list" :key="content.id">
                      <td class="table-padding">{{ cat }}</td>
                      <td>{{ content.name }}</td>
                      <td v-for="item in items" :key="item.id"><v-checkbox hide-details dense></v-checkbox></td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ContextType, ContextTypes, IContent, IContext, IScenario } from "../models";
import { CollectionNames, IAppModel, ICollectionRecord } from "../services/meiosis";
import { CollectionsModel } from "../services/states/collection-state";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class TableCard extends Vue {
  @Prop({ default: "ThreatDirection" }) public category!: CollectionNames;
  @Prop({ default: () => [] }) public othercategories!: CollectionNames[];
  public items: Partial<IContent>[] = [];
  private collections: CollectionsModel<IContent> | null = null;

  @Watch("category")
  private categoryChanged() {
    this.init();
  }

  private otherCategoriesWithoutSelected() {
    return this.othercategories.filter((c) => c != this.category);
  }

  constructor() {
    super();
  }

  private async init() {
    this.$store.states.map((s: IAppModel) => {
      this.items = s[this.category].list!;
      this.collections = s;
    });
  }

  async mounted() {
    console.log(`Table card mounted`);
    this.init();
  }
}
</script>

<style scoped lang="css">
.consistency-table .v-input--checkbox {
  margin-top: 0;
}
.consistency-table td {
  align-items: center;
  justify-content: center;
}
.table-padding {
  padding: 4px;
}
.full-width {
  min-width: 100%;
}
</style>
