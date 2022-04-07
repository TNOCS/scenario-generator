<template>
  <v-card class="full-width full-height table-card">
    <v-card-text class="pa-0 full-width full-height-min-title">
      <v-container fluid class="ma-0 pa-0 full-height">
        <v-row no-gutters class="full-height">
          <v-col v-if="collections" class="full-height">
            <v-simple-table
              v-if="category && category2 && category !== category2"
              dense
              fixed-header
              height="100%"
              class="full-height"
            >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left bold--text">{{ $tc('APP.DIMENSION') | capitalize }}</th>
                    <th class="text-left bold--text more-padding">{{ $tc('APP.NAME') | capitalize }}</th>
                    <th class="text-left" v-for="headerItem in items" :key="headerItem.id">{{ headerItem.name | capitalize }}</th>
                  </tr>
                </thead>
                <tbody class="consistency-table">
                  <!-- <template v-for="cat in otherCategoriesWithoutSelected()"> -->
                  <template v-for="cat in [category2]">
                    <tr v-for="content in collections[cat].list" :key="content.id">
                      <td>{{ $tc(`COMP.${cat.toLocaleUpperCase()}`) | capitalize }}</td>
                      <td class="more-padding">{{ content.name | capitalize }}</td>
                      <td v-for="hi in items" :key="hi.id">
                        <TableSelectButton
                          :contentId="content.id"
                          :hiId="hi.id"
                          :consType="consType(content.id, hi.id)"
                          @changeconsistency="changeconsistency"
                        ></TableSelectButton>
                      </td>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IContent, Inconsistency, InconsistencyType } from '../models';
import { CollectionNames, IAppModel } from '../services/meiosis';
import { CollectionsModel } from '../services/states/collection-state';
import TableSelectButton from './table-select-button.vue';

const findInconsistency = (fromId: string, toId: string) => (ic: Inconsistency) =>
  ic.ids.indexOf(fromId) >= 0 && ic.ids.indexOf(toId) >= 0;

@Component({
  components: { TableSelectButton },
})
export default class TableCard extends Vue {
  @Prop({ default: null }) public category!: CollectionNames | null;
  @Prop({ default: null }) public category2!: CollectionNames | null;
  @Prop({ default: () => [] }) public othercategories!: CollectionNames[];
  @Prop({ default: () => [] }) public inconsistencies!: Inconsistency[];
  public items: Partial<IContent>[] = [];
  private collections: CollectionsModel<IContent> | null = null;
  private alwaysTrue = true;

  @Watch('category')
  private categoryChanged(newCat: string) {
    console.log(`categoryChanged to ${newCat}`);
    this.init();
  }

  private otherCategoriesWithoutSelected() {
    return this.othercategories.filter(c => c !== this.category);
  }

  constructor() {
    super();
  }

  private consType(fromId: string, toId: string) {
    const found = this.inconsistencies.filter(findInconsistency(fromId, toId)).pop();
    return found ? found.type : undefined;
  }

  private changeconsistency(fromId: string, toId: string, consType: InconsistencyType) {
    // console.log({ fromId, toId, consType });
    // console.time('Change consistencies');
    if (!consType) {
      // If combination should be removed
      const indexToDelete = this.inconsistencies.findIndex(findInconsistency(fromId, toId));
      if (indexToDelete >= 0) this.inconsistencies.splice(indexToDelete, 1);
    } else {
      // If combination should not be removed
      const found = this.inconsistencies.filter(findInconsistency(fromId, toId)).pop();
      if (found) {
        // If combination already exists
        found.type = consType;
      } else {
        // If combination not exists yet
        this.inconsistencies.push({ ids: [fromId, toId], type: consType });
      }
    }
    // console.timeEnd('Change consistencies');
    this.$store.actions.updateInconsistencies(this.inconsistencies);
  }

  private async init() {
    this.$store.states.map((s: IAppModel) => {
      this.items = this.category && s[this.category] ? s[this.category].list || [] : [];
      this.collections = s;
    });
  }

  async mounted(): Promise<void> {
    console.log(`Table card mounted`);
    await this.init();
  }
}
</script>

<style lang="css">
.consistency-table .v-input--checkbox {
  margin-top: 0;
}
.consistency-table .v-input__slot {
  align-items: center;
  justify-content: center;
}
.table-padding {
  padding: 4px;
}
.consistency-table td.more-padding {
  padding-right: 48px !important;
}
.full-height-min-title {
  height: calc(100% - 24px);
}
.table-card tbody,
.table-card table {
  height: 100%;
}
</style>
