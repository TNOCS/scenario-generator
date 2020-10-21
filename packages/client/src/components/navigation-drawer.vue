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
              <span><CountryFlag :iso="l" mode="squared"></CountryFlag> {{ l }}</span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">{{ $t("APP.THEME") }}</div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <v-radio-group v-model="activeTheme" @change="themeChanged" class="ind-radio">
          <v-radio v-for="t in themes" :key="t" :label="t" :value="t"> </v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">
        {{ $t("APP.SCENARIO") }}
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" color="accent darken-1" fab x-small elevation="2" class="mr-1 add-button">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <AddComponentCard itemkey="scenarios" @close="closeMenu"></AddComponentCard>
        </v-menu>
      </div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <v-select
          v-model="activeScenario"
          :items="scenarios"
          item-text="name"
          return-object
          @change="scenarioSelected"
        ></v-select>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { languageStorageKey } from "../i18n";
import CountryFlag from "@dzangolab/vue-country-flag-icon";
import { IScenario } from "../models";
import AddComponentCard from "./add-component-card.vue";

@Component({
  components: { CountryFlag, AddComponentCard },
})
export default class NavigationDrawer extends Vue {
  private languages: string[] = ["gb", "nl"];
  private activeLanguage: string = "";
  private themes: string[] = ["light", "dark"];
  private scenarios: Partial<IScenario>[] = [];
  private activeTheme: string = "";
  private activeScenario: Partial<IScenario> = {};
  private menu: boolean = false;

  private async languageChanged() {
    this.$store.actions.changeLanguage(this.activeLanguage);
  }

  private async themeChanged() {
    this.$store.actions.changeTheme(this.activeTheme);
  }

  private async scenarioSelected() {
    this.$store.actions[this.activeScenario.type!].load(this.activeScenario.id!);
  }

  private async closeMenu() {
    this.menu = false;
  }

  async mounted() {
    this.$store.states.map((a) => {
      this.activeLanguage = a.app.language;
      this.activeTheme = a.app.theme;
      this.scenarios = a.scenarios.list || [];
      this.activeScenario = a.scenarios.current || {};
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
.add-button {
  float: right;
}
</style>
