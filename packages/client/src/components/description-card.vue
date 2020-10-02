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
      <v-list-item v-for="a in actors" :key="a.id" @click="delActor(a)">
        <v-list-item-content>
          <v-list-item-title>{{ a.name.en }}</v-list-item-title>
          <v-list-item-subtitle>{{ a.id }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IContent } from "../models";
@Component({
  components: {},
})
export default class DescriptionCard extends Vue {
  @Prop({ default: "" }) public html!: string;
  @Prop({ default: "" }) public subtitle!: string;
  private actors: Partial<IContent>[] = [];

  constructor() {
    super();
  }

  private delActor(a: IContent): void {
    this.$store.actions.actors.del(a.id);
  }

  async mounted() {
    await this.$store.actions.actors.updateList();
    this.$store.states.map((s) => {
      this.actors = s.actors.list;
    });
  }
}
</script>

<style scoped lang="css">
.text-description {
  overflow-y: auto;
}
</style>
