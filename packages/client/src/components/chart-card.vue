<template>
  <v-card flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">{{ title }} - {{ formattedTime() }}</div>
    <v-divider />
    <v-card-text class="text-description">
      <v-btn @click="addActor">{{ $t("APP.ADD", { item: $tc("APP.ACTOR") }) }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { lightFormat } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {},
})
export default class ChartCard extends Vue {
  private title: string = "Chart";
  private time: number = 0;
  private timer?: any;
  private activeWord: number = -1;
  private words: string[] = [];

  constructor() {
    super();
  }

  private async init() {
    if (!!this.timer) return;
    this.timer = setInterval(() => {
      this.time = Date.now();
    }, 500);
  }

  private formattedTime(): string {
    return lightFormat(this.time, "yyyy-MM-dd '@' HH:mm:ss");
  }

  private addActor(): void {
    this.$store.actions.actors.save({ id: uuidv4(), name: "Hannibal", type: "Actor" });
  }

  destroyed() {
    if (!!this.timer) return;
    clearInterval(this.timer);
  }

  mounted() {
    this.init();
  }
}
</script>

<style scoped lang="css"></style>
