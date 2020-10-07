<template>
  <v-navigation-drawer width="200px" app clipped floating permanent class="noselect">
    <v-subheader class="font-weight-thin">CONTROLS</v-subheader>
    <v-row no-gutters align-content="center" justify="center">
      <v-img :src="require('../assets/words.png')" max-width="100" contain />
    </v-row>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">{{ $t("APP.LANGUAGE") }}</div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <v-radio-group v-model="activeLanguage" @change="languageChanged" class="ind-radio">
          <v-radio v-for="l in languages" :key="l" :label="l" :value="l">
            <template v-slot:label>
              <div><CountryFlag :iso="l" mode="squared"></CountryFlag> {{ l }}</div>
            </template>
          </v-radio>
        </v-radio-group>
        <CountryFlag iso="nl" mode="squared"></CountryFlag>
      </v-card-text>
    </v-card>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">{{ $t("APP.THEME") }}</div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <v-radio-group v-model="activeTheme" @change="themeChanged" class="ind-radio">
          <v-radio v-for="t in themes" :key="t" :label="t" :value="t"> </v-radio>
        </v-radio-group>
        <CountryFlag iso="nl" mode="squared"></CountryFlag>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { languageStorageKey } from "../i18n";
import CountryFlag from "@dzangolab/vue-country-flag-icon";

@Component({
  components: { CountryFlag },
})
export default class NavigationDrawer extends Vue {
  private languages: string[] = ["gb", "nl"];
  private activeLanguage: string = "";
  private themes: string[] = ["light", "dark"];
  private activeTheme: string = "";

  private async languageChanged() {
    this.$store.actions.changeLanguage(this.activeLanguage);
  }

  private async themeChanged() {
    this.$store.actions.changeTheme(this.activeTheme);
  }

  async mounted() {
    this.$store.states.map((a) => {
      this.activeLanguage = a.app.language;
      this.activeTheme = a.app.theme;
    });
  }
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
