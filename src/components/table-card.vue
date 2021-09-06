<template>
  <v-card class="full-width full-height table-card">
    <v-card-text class="pa-0 full-width full-height-min-title">
      <v-container fluid class="ma-0 pa-0 full-height">
        <v-row no-gutters class="full-height">
          <v-col v-if="collections" class="full-height">
            <v-simple-table dense fixed-header height="100%" class="full-height">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left bold--text">{{ $tc('APP.DIMENSION') | capitalize }}</th>
                    <th class="text-left bold--text more-padding">{{ $tc('APP.NAME') | capitalize }}</th>
                    <th class="text-left" v-for="headerItem in items" :key="headerItem.id">{{ headerItem.name | capitalize }}</th>
                  </tr>
                </thead>
                <tbody class="consistency-table">
                  <template v-for="cat in otherCategoriesWithoutSelected()">
                    <tr v-for="content in collections[cat].list" :key="content.id">
                      <td>{{ $tc(`COMP.${cat.toLocaleUpperCase()}`) | capitalize }}</td>
                      <td class="more-padding">{{ content.name | capitalize }}</td>
                      <td v-for="hi in items" :key="hi.id">
                        <!-- Partly inconsistent; combination improbable -->
                        <v-tooltip right v-if="incons(content.id, hi.id, 'partly')" open-delay="1000">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-on="on" v-bind="attrs" icon @click.stop="setcons(content.id, hi.id, undefined)">
                              <v-icon>mdi-checkerboard</v-icon>
                            </v-btn></template
                          >
                          <span>{{ $t('APP.PARTLY_CONSISTENT') }}</span>
                        </v-tooltip>
                        <!-- Totally inconsistent; combination impossible -->
                        <v-tooltip right v-if="incons(content.id, hi.id, 'totally')" open-delay="1000">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-on="on" v-bind="attrs" icon @click.stop="setcons(content.id, hi.id, 'partly')">
                              <v-icon>mdi-checkbox-blank-outline</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('APP.INCONSISTENT') }}</span>
                        </v-tooltip>
                        <!-- No inconsistency; combination possible -->
                        <v-tooltip right v-if="incons(content.id, hi.id, undefined)" open-delay="1000">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-on="on" v-bind="attrs" icon @click.stop="setcons(content.id, hi.id, 'totally')">
                              <v-icon>mdi-checkbox-blank</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('APP.CONSISTENT') }}</span>
                        </v-tooltip>
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

@Component({
  components: {},
})
export default class TableCard extends Vue {
  @Prop({ default: null }) public category!: CollectionNames | null;
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
    return this.othercategories.filter(c => c != this.category);
  }

  constructor() {
    super();
  }

  private incons(fromId: string, toId: string, inconstistency?: InconsistencyType) {
    const found = this.inconsistencies.filter(ic => ic.ids.includes(fromId) && ic.ids.includes(toId)).pop();
    if (found) {
      return found.type === inconstistency;
    } else {
      return !inconstistency;
    }
  }

  private setcons(fromId: string, toId: string, inconstistency?: InconsistencyType) {
    if (!inconstistency) {
      // If combination should be removed
      const indexToDelete = this.inconsistencies.findIndex(ic => ic.ids.includes(fromId) && ic.ids.includes(toId));
      if (indexToDelete >= 0) this.inconsistencies.splice(indexToDelete, 1);
    } else {
      // If combination should not be removed
      const found = this.inconsistencies.filter(ic => ic.ids.includes(fromId) && ic.ids.includes(toId)).pop();
      if (found) {
        // If combination already exists
        found.type = inconstistency;
      } else {
        // If combination not exists yet
        this.inconsistencies.push({ ids: [fromId, toId], type: inconstistency });
      }
    }
    this.$store.actions.updateInconsistencies(this.inconsistencies);
  }

  private async init() {
    this.$store.states.map((s: IAppModel) => {
      this.items = this.category ? s[this.category].list || [] : [];
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
