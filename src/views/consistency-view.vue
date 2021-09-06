<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <ConsistencyMatrices />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'splitpanes/dist/splitpanes.css';
import ConsistencyMatrices from '../components/consistency-matrices.vue';

@Component({
  components: { ConsistencyMatrices },
})
export default class ConsistencyView extends Vue {
  mounted(): void {
    console.log(`ConsistencyView mounted`);
  }
}
</script>

<style scoped lang="css"></style>
