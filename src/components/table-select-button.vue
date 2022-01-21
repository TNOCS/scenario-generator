<template>
  <v-tooltip right open-delay="1000">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs" icon @click.stop="changeCons()">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t(tooltipTxt) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class TableSelectButton extends Vue {
  /** Consistency type */
  @Prop({ type: String, default: null }) public consType: undefined | 'totally' | 'partly';
  @Prop({ type: String, default: '' }) public contentId!: string;
  @Prop({ type: String, default: '' }) public hiId!: string;

  private icon = 'mdi-checkbox-blank-outline';
  private consistencyType: undefined | 'totally' | 'partly';
  private tooltipTxt = '';

  constructor() {
    super();
  }

  private async changeCons() {
    this.consistencyType =
      this.consistencyType === 'totally' ? 'partly' : this.consistencyType === 'partly' ? undefined : 'totally';
    this.$emit('changeconsistency', this.contentId, this.hiId, this.consistencyType);
    await this.update();
  }

  private async update() {
    this.icon =
      this.consistencyType === 'partly'
        ? 'mdi-checkerboard'
        : this.consistencyType === 'totally'
        ? 'mdi-checkbox-blank-outline'
        : 'mdi-checkbox-marked';
    this.tooltipTxt =
      this.consistencyType === 'partly'
        ? 'APP.PARTLY_CONSISTENT'
        : this.consistencyType === 'totally'
        ? 'APP.INCONSISTENT'
        : 'APP.CONSISTENT';
  }

  async mounted(): Promise<void> {
    this.consistencyType = this.consType;
    await this.update();
  }
}
</script>
