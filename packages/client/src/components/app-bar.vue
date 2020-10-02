<template>
  <v-app-bar app dense flat clipped-left height="42" class="ind-app-bar noselect font-weight-light">
    <v-icon class="home-icon pr-3" :to="'edit'">mdi-shield</v-icon>
    <v-toolbar-title>V2018 Scenario Generator</v-toolbar-title>
    <div class="text-center">
      <v-btn class="ml-8 mx-2 my-2 app-btn" outlined :to="'edit'" small color="blue">
        <v-icon left>mdi-pencil</v-icon>Edit scenario
      </v-btn>
      <v-btn class="mx-2 my-2 app-btn" outlined :to="'show'" small color="blue">
        <v-icon left>mdi-graph-outline</v-icon>Show scenario
      </v-btn>
    </div>
    <v-spacer />
    <v-sheet class="blue px-2 d-flex" height="100%" tile>
      <v-img :src="require('../assets/tno.png')" max-width="50" contain />
    </v-sheet>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AppBar extends Vue {
  private chartDialog: boolean = false;
}
</script>

<style lang="css">
.home-icon:active {
  color: #ff9800;
}

.v-icon--link::after {
  opacity: 0 !important;
}

.v2018-app-bar .v-toolbar__content {
  padding-right: 0;
}

.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 98vh;
}

.flexcard {
  display: flex;
  flex-direction: column;
}
</style>
