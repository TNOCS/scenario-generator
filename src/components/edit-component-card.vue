<template>
  <v-card>
    <v-card-title dense class="edit-component-card">
      {{ $t("APP.EDIT", { item: this.getTranslateKey() }) }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-text-field
        :label="`${$t('APP.NAME')}` | capitalize"
        v-model="newName"
        autofocus
        v-on:keyup.enter="editItem"
      ></v-text-field>
      <v-text-field label="Type" disabled v-model="itemkey">itemkey</v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel"> {{ $t("APP.CANCEL") }} </v-btn>
      <v-btn color="primary" text @click="editItem"> {{ $t("APP.SAVE") }} </v-btn>
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
export default class EditComponentCard extends Vue {
  @Prop({ default: "" }) public itemkey!: CollectionNames;
  @Prop({ default: "" }) public itemname!: string;
  @Prop({ default: "" }) public itemid!: string;
  private newName: string = "";
  constructor() {
    super();
  }

  private getTranslateKey() {
    return this.$tc(`COMP.${this.itemkey.toUpperCase()}`);
  }

  private async editItem() {
    await this.$store.actions[this.itemkey].save({ id: this.itemid, name: this.newName });
    await this.$store.actions[this.itemkey].load(this.itemid);
    this.$emit("close");
  }

  private async cancel() {
    this.$emit("close");
  }

  async mounted() {}
}
</script>

<style scoped lang="css">
.edit-component-card {
  cursor: pointer;
}
</style>
