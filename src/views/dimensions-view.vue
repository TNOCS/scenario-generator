<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <KanbanLists />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'splitpanes/dist/splitpanes.css';
import KanbanLists from '../components/kanban-lists.vue';

@Component({
  components: { KanbanLists },
})
export default class DimensionsView extends Vue {
  mounted(): void {
    console.log(`DimensionsView mounted`);
  }
}
</script>

<style scoped lang="css"></style>
