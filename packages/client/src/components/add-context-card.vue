<template>
  <v-card>
    <v-card-title dense class="add-context-card">
      {{ $t("APP.ADD", { item: "context" }) }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-select v-model="activeType" :items="types" @change="typeSelected"></v-select>
      <v-text-field :label="`${$t('APP.KEY')}` | capitalize" v-model="activeKey" autofocus></v-text-field
      ><v-text-field :label="`${$t('APP.VALUE')}` | capitalize" v-model="activeVal" v-on:keyup.enter="addItem"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel"> {{ $t("APP.CANCEL") }} </v-btn>
      <v-btn color="primary" text @click="addItem"> {{ $t("APP.SAVE") }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ContextType, ContextTypes, IContent, IContext, IScenario } from "../models";
import { CollectionNames } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class AddContextCard extends Vue {
  @Prop({ default: () => {} }) public item!: Partial<IContent>;
  private types: ContextType[] = [...ContextTypes];
  private activeType: ContextType = "NONE";
  private activeKey: string = "";
  private activeVal: string = "";
  private newContext: IContext = { type: "NONE", data: {} };

  @Watch("item", { deep: true })
  private itemChanged() {
    console.log(`Item changed`);
    this.resetNewItem();
    if (this.item && this.item.context) {
      this.activeType = this.item.context.type;
      this.activeKey = Object.keys(this.item.context.data).shift() || "";
      this.activeVal = Object.values(this.item.context.data).shift() || "";
    }
  }

  constructor() {
    super();
  }

  private typeSelected() {
    this.newContext = { type: this.activeType, data: {} };
  }

  private async addItem() {
    this.newContext.type = this.activeType;
    this.newContext.data[this.activeKey] = this.activeVal;
    this.item.context = Object.assign({}, this.newContext) as IContext;
    this.$store.actions[this.item.type!].save(this.item);
    this.$emit("close");
  }

  private resetNewItem() {
    this.activeKey = "";
    this.activeVal = "";
    this.activeType = "NONE";
  }

  private async cancel() {
    this.$emit("close");
  }

  async mounted() {
    console.log(`Add context card mounted`);
    this.itemChanged();
  }
}
</script>

<style scoped lang="css">
.add-component-card {
  cursor: pointer;
}
</style>
