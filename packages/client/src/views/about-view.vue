<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col md="12" cols="12" class="full-height">
        <span class="mardown-tekst" v-html="getMarkdown()"></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import marked from "marked";
import dompurify from "dompurify";

@Component({
  components: {},
})
export default class AboutView extends Vue {
  private getMarkdown(): string {
    const text = "## Developed by TNO";
    return marked(text, { sanitizer: dompurify.sanitize });
  }

  async mounted() {
    console.log(`AboutView mounted`);
  }
}
</script>

<style scoped lang="css"></style>
