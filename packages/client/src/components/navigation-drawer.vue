<template>
  <v-navigation-drawer width="240px" app clipped floating permanent class="noselect no-print">
    <v-subheader class="font-weight-thin"></v-subheader>
    <v-row no-gutters class="mb-4" align-content="center" justify="center">
      <v-img :src="require('../assets/words.png')" max-width="100" contain />
    </v-row>
    <v-card flat tile class="" style="background: transparent">
      <div class="overline px-2 py-2">
        {{ $t("APP.SCENARIO") }}
      </div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <div class="blue--text">
          {{ $t("APP.ACTIVE", { item: $tc("COMP.SCENARIOS") }) | capitalize }}:
          <span class="bold--text">{{ this.activeScenario.name || "-" }} </span>
          <span>
            <v-menu v-if="activeScenario" v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" color="blue" icon x-small elevation="2" class="mr-1 add-button">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <!-- prettier-ignore -->
              <EditComponentCard itemkey="scenarios" :itemid="activeScenario.id" @close="closeMenu" 
                :itemname="activeScenario.name"></EditComponentCard>
            </v-menu>
          </span>
        </div>
      </v-card-text>
    </v-card>
    <v-row no-gutters class="mt-2 ml-4">
      <v-menu v-model="importMenu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" color="accent darken-1" small elevation="2" class="mr-1">
            <v-icon class="pr-1" small>mdi-import</v-icon> Import/export
          </v-btn>
        </template>
        <ImportExportCard @close="closeImportMenu"></ImportExportCard>
      </v-menu>
    </v-row>
    <v-card flat tile class="mb-0" style="background: transparent" v-if="activeScenario">
      <div class="overline px-2 py-2">{{ $tc("COMP.NARRATIVE", 2) }}</div>
      <v-divider />
      <v-card-text class="text-description px-4 py-1">
        <div class="blue--text">
          {{ $t("APP.ACTIVE", { item: $tc("COMP.NARRATIVE") }) | capitalize }}:
          <span class="bold--text">{{ this.activeNarrative.name || "-" }} </span>
          <span>
            <v-menu v-if="activeNarrative" v-model="narMenu" :close-on-content-click="false" :nudge-width="200" offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" color="blue" icon x-small elevation="2" class="mr-1 add-button">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
            </v-menu>
          </span>
        </div>
      </v-card-text>
    </v-card>
    <v-row no-gutters class="my-0 ml-4">
      <!-- prettier-ignore -->
      <v-select v-model="activeNarrative" :items="activeScenario.narratives" item-text="name" return-object 
          dense hide-details @change="narrativeSelected"></v-select>
    </v-row>
    <v-card flat tile class="mt-6" style="background: transparent">
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
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { languageStorageKey } from "../i18n";
import CountryFlag from "@dzangolab/vue-country-flag-icon";
import { INarrative, IScenario } from "../models";
import EditComponentCard from "./edit-component-card.vue";
import ImportExportCard from "./import-export-card.vue";

@Component({
  components: { CountryFlag, EditComponentCard, ImportExportCard },
})
export default class NavigationDrawer extends Vue {
  private languages: string[] = ["gb", "nl"];
  private activeLanguage: string = "";
  private themes: string[] = ["light", "dark"];
  private scenarios: Partial<IScenario>[] = [];
  private activeTheme: string = "";
  private activeScenario: Partial<IScenario> = {};
  private activeNarrative: INarrative = {} as INarrative;
  private menu: boolean = false;
  private importMenu: boolean = false;
  private narMenu: boolean = false;

  private async languageChanged() {
    this.$store.actions.changeLanguage(this.activeLanguage);
  }

  private async themeChanged() {
    this.$store.actions.changeTheme(this.activeTheme);
  }

  private async narrativeSelected() {
    this.$store.actions.changeNarrative(this.activeNarrative);
  }

  private async closeMenu() {
    this.menu = false;
  }

  private async closeImportMenu() {
    this.importMenu = false;
  }

  private activeScenarioName() {
    this.activeScenario.name ? this.activeScenario.name : "-";
  }

  async mounted() {
    console.log(`navigation mounted`);
    this.$store.states.map(a => {
      this.activeLanguage = a.app.language;
      this.activeTheme = a.app.theme;
      this.scenarios = a.scenarios.list || [];
      this.activeScenario = a.scenarios.current || {};
      this.activeNarrative = a.app.narrative || ({} as INarrative);
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
