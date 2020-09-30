<template>
  <v-card flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">Description</div>
    <div v-if="subtitle && subtitle.length > 0" class="px-4 pt-0 pb-2 v-card__text">
      {{ subtitle }}
    </div>
    <v-divider />
    <v-card-text class="text-description">
      <div v-html="html" />
      <v-divider class="my-6"></v-divider>
      <div>...</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class DescriptionCard extends Vue {
  @Prop({ default: "" }) public html!: string;
  @Prop({ default: "" }) public subtitle!: string;

  constructor() {
    super();
  }

  async mounted() {}
}
</script>

<style scoped lang="css">
.text-description {
  overflow-y: auto;
}
</style>
