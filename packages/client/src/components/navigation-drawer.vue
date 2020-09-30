<template>
  <v-navigation-drawer
    width="240px"
    app
    clipped
    floating
    permanent
    class="noselect"
  >
    <v-subheader class="font-weight-thin">CONTROLS</v-subheader>
    <v-row no-gutters align-content="center" justify="center">
      <v-img :src="require('../assets/words.png')" max-width="100" contain />
    </v-row>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">Language</div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <v-radio-group
          v-model="activeLanguage"
          @change="languageChanged"
          class="ind-radio"
        >
          <v-radio
            v-for="l in languages"
            :key="l"
            :label="l"
            :value="l"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {},
})
export default class NavigationDrawer extends Vue {
  private languages: string[] = ["EN", "NL"];
  private activeLanguage: string = "EN";

  private async languageChanged() {}

  async mounted() {}
}
</script>

<style scoped lang="css">
.theme--light.v-navigation-drawer {
  background-color: #eaeaea;
}
.v2018-radio {
  margin-top: 2px;
}
</style>
