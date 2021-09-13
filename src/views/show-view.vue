<template>
  <v-container class="no-scroll full-height pa-0" fluid>
    <v-row no-gutters class="full-width full-height">
      <v-col md="12" cols="12" class="full-height">
        <splitpanes vertical class="full-height">
          <pane min-size="10" size="50" class="pa-0">
            <splitpanes horizontal class="full-height">
              <pane min-size="10" size="60" class="pa-2">
                <NarrativeComponentsVert></NarrativeComponentsVert>
              </pane>
              <pane min-size="10" size="40" class="pa-2">
                <ScenarioTextVert></ScenarioTextVert>
                <v-btn @click="copyToClipboard" color="accent darken-1" elevation="2" class="d-flex ma-4 ml-8 btn-right">
                  <v-icon>mdi-clipboard-arrow-up-outline</v-icon>
                  {{ '&nbsp;&nbsp;' + $t('APP.COPY') }}
                </v-btn>
              </pane>
            </splitpanes>
          </pane>

          <pane min-size="10" size="50" class="pa-2">
            <MapCard></MapCard>
          </pane>
        </splitpanes>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'splitpanes/dist/splitpanes.css';
import { Splitpanes, Pane } from 'splitpanes';
import MapCard from '../components/map-card.vue';
import DescriptionCard from '../components/description-card.vue';
import ScenarioTextVert from '../components/scenario-text-vert.vue';
import NarrativeComponentsVert from '../components/narrative-components-vert.vue';
import { htmlTemplate, cssTable } from '@/assets/html-styles';
import { ContentCategory, IContent } from '@/models';
import { CollectionType } from '@/services/states/collection-state';
import { capitalize } from 'lodash';
import { render } from 'slimdown-js';

@Component({
  components: { Splitpanes, Pane, DescriptionCard, NarrativeComponentsVert, MapCard, ScenarioTextVert },
})
export default class ShowView extends Vue {
  private panels: number[] = [0, 1, 2];

  mounted(): void {
    console.log(`Show mounted`);
  }

  private copyToClipboard() {
    const state = this.$store.states();
    const scenario = state.scenarios.current;
    const categories = scenario && scenario.categories;
    const categoryNames = categories && (Object.keys(categories) as ContentCategory[]);
    const narrative = state.app.narrative;

    if (!categoryNames || !categories || !narrative) return;

    const singleDim = categoryNames.length === 1;
    const intro = singleDim
      ? `# ${capitalize(narrative.name)}`
      : `# ${capitalize(narrative.name)}
## ${capitalize(this.$tc('APP.DIMENSION', 2))}`;

    const headers = `|${capitalize(this.$tc('APP.DIMENSION'))}|${capitalize(this.$tc('APP.SELECTED'))}|`;
    const format = '|-----|-----|';
    const dimensionTables = categoryNames
      .map(categoryName => {
        const category = categories[categoryName];
        const components = narrative.components;
        const tbody = category
          .map(c => {
            const ct = state[c] as CollectionType<IContent>;
            const component = ct && ct.list && ct.list.filter(i => i.id === components[c]).shift();
            return component && `| ${capitalize(this.$tc(`COMP.${c.toUpperCase()}`))} | ${component.name} |`;
          })
          .join('\n');
        const table = `
${headers}
${format}
${tbody}`;
        return `${singleDim ? '##' : '###'} ${categoryName} ${this.$tc('APP.DIMENSION')}
${table}`;
      })
      .join('\n\n');

    const narrativeTxt = `## ${capitalize(this.$tc('COMP.NARRATIVE'))} (${this.$tc(
      narrative.included ? 'APP.NARRATIVE_INCLUDED' : 'APP.NARRATIVE_NOT_INCLUDED'
    )})

${narrative.narrative.replace(/(#+)/g, '$1##')}`;

    const md = `${intro}

${dimensionTables}

${narrativeTxt}`;
    console.log(md);
    const html = render(md);

    function listener(e: ClipboardEvent) {
      if (!e.clipboardData) return;
      e.clipboardData.setData('text/html', htmlTemplate({ body: html, css: cssTable }));
      e.clipboardData.setData('text/plain', md);
      e.preventDefault();
    }
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
}
</script>

<style scoped lang="css">
.full-width {
  width: 100%;
}
.map-height {
  height: calc(100% - 640px);
}
.no-scroll.full-height {
  height: 100% !important;
  overflow-x: hidden;
}
</style>
