<template>
  <v-card>
    <v-card-title dense class="add-component-card">
      {{ $t("APP.ADD", { item: this.getTranslateKey() }) }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-text-field
        :label="`${$t('APP.NAME')}` | capitalize"
        v-model="newItem.name"
        autofocus
        v-on:keyup.enter="addItem"
      ></v-text-field>
      <v-text-field label="Type" disabled v-model="newItem.type">itemkey</v-text-field>
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
import { IContent, IScenario } from "../models";
import { CollectionNames } from "../services/meiosis";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class AddComponentCard extends Vue {
  @Prop({ default: "" }) public itemkey!: CollectionNames;
  private newItem: Partial<IContent> = {};

  constructor() {
    super();
  }

  private getTranslateKey() {
    return this.$tc(`COMP.${this.itemkey}`);
  }

  private resetNewItem() {
    this.newItem = { name: "", type: this.itemkey, id: getUuid() };
  }

  private async addItem() {
    this.$store.actions[this.itemkey].save(this.newItem);
    this.resetNewItem();
    this.$emit("close");
  }

  private async cancel() {
    this.resetNewItem();
    this.$emit("close");
  }

  async mounted() {
    this.resetNewItem();
  }
}
</script>

<style scoped lang="css">
.add-component-card {
  cursor: pointer;
}
</style>
