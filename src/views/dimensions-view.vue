<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <KanbanLists v-bind:vertical-direction="verticalDirection" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import 'splitpanes/dist/splitpanes.css';
import KanbanLists from '../components/kanban-lists.vue';

@Component({
  components: { KanbanLists },
})
export default class DimensionsView extends Vue {
  private verticalDirection = false;

  mounted(): void {
    console.log(`DimensionsView mounted`);
    this.$store.states.map(s => {
      this.verticalDirection = s.app.kanbanDirVert;
    });
  }

  @Watch('kanbanDirVert')
  kanbanDirVertUpdated(dir: boolean): void {
    this.verticalDirection = dir;
  }
}
</script>

<style scoped lang="css"></style>
