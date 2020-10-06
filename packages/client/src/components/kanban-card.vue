<template>
  <v-card tile class="flex-card ma-1" elevation="2" color="#5FB0C7">
    <v-card-title> {{ $tc("APP.ACTOR") | capitalize }}: {{ item.name }} </v-card-title>
    <v-card-text class="text-description">
      {{ item.id }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IContent } from "../models";

@Component({
  components: {},
})
export default class KanbanCard extends Vue {
  @Prop({ default: () => {} }) public item!: Partial<IContent>;

  constructor() {
    super();
  }

  mounted() {}
}
</script>

<style scoped lang="css"></style>
