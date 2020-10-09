<template>
  <v-card dense flat tile class="flex-card scenario-bar">
    <v-card-text class="text-description ma-0 py-2 px-2">
      <v-container fluid class="ma-0 pa-0">
        <v-row no-gutters>
          <v-col md="2">
            {{ $t("APP.ACTIVE_SCENARIO") | capitalize }}:
            <span class="title-name"> {{ this.activeScenarioName }} </span></v-col
          >
          <v-col md="10">
            <v-btn :to="'add'" color="accent darken-1" icon x-small class="mr-2">
              <v-icon>mdi-folder-open</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { IScenario } from "../models";
import { getUuid } from "../utils/constants";

@Component({
  components: {},
})
export default class ActiveScenario extends Vue {
  private activeScenario?: Partial<IScenario>;
  private activeScenarioName: string = "None";

  private async addScenario() {
    const scenario: IScenario = { id: getUuid(), name: "Nieuw scenario", type: "scenarios", sentences: [] };
    await this.$store.actions.scenarios.save(scenario);
    await this.$store.actions.scenarios.load(scenario.id);
  }

  async mounted() {
    this.$store.states.map((s) => {
      this.activeScenario = s.scenarios.current;
      if (this.activeScenario) {
        this.activeScenarioName = this.activeScenario ? this.activeScenario.name! : "None";
      }
    });
  }
}
</script>

<style lang="css">
.scenario-bar {
  height: 40px;
}
.scenario-bar.v-card.theme--light {
  background: lightgrey;
}
.scenario-bar.v-card.theme--dark {
  background: rgb(48, 48, 48);
}
.title-name {
  font-weight: bold;
}
</style>
