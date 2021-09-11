<template>
  <v-card>
    <v-card-title dense class="edit-component-card">
      {{ $t('APP.EDIT', { item: this.getTranslateKey() }) }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-text-field
        :label="`${$t('APP.NAME')}` | capitalize"
        v-model="newName"
        autofocus
        v-on:keyup.enter="editItem"
      ></v-text-field>
      <v-text-field
        :label="`${$tc('APP.DESCRIPTION', 1)}` | capitalize"
        v-model="desc"
        v-on:keyup.enter="editItem"
      ></v-text-field>
      <v-text-field label="Type" disabled v-model="itemkey">itemkey</v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="deleteItem"> {{ $t('APP.DELETE_ITEM') }} </v-btn>
      <v-btn text @click="cancel"> {{ $t('APP.CANCEL') }} </v-btn>
      <v-btn color="primary" text @click="editItem"> {{ $t('APP.SAVE') }} </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CollectionNames } from '../services/meiosis';

@Component({
  components: {},
})
export default class EditComponentCard extends Vue {
  @Prop({ default: '' }) public itemkey!: CollectionNames;
  @Prop({ default: '' }) public itemname!: string;
  @Prop({ default: '' }) public itemdesc!: string;
  @Prop({ default: '' }) public itemid!: string;
  private newName = '';
  private desc = '';
  constructor() {
    super();
  }

  private getTranslateKey() {
    return this.$tc(`COMP.${this.itemkey.toUpperCase()}`);
  }

  private editItem() {
    this.$store.actions[this.itemkey].save({ id: this.itemid, name: this.newName, desc: this.desc });
    this.$store.actions[this.itemkey].load(this.itemid);
    this.$emit('close');
  }

  private deleteItem() {
    this.$store.actions[this.itemkey].del(this.itemid);
    this.$emit('close');
  }

  private async cancel() {
    this.$emit('close');
  }

  mounted(): void {
    this.newName = this.itemname;
  }
}
</script>

<style scoped lang="css">
.edit-component-card {
  cursor: pointer;
}
</style>
