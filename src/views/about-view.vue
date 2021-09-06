/* eslint-disable prettier/prettier */
<template>
  <v-container class="full-height pa-0" fluid>
    <v-row no-gutters class="full-height" justify="center">
      <v-col lg="10" sm="12" cols="12" class="full-height">
        <div class="markdown-tekst" v-html="getMarkdown()"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import marked from 'marked';
import dompurify from 'dompurify';
import aboutText from '../assets/about.md';

@Component({
  components: {},
})
export default class AboutView extends Vue {
  private getMarkdown(): string {
    const text = aboutText;
    return marked(text, { sanitizer: dompurify.sanitize });
  }

  mounted(): void {
    console.log(`AboutView mounted`);
  }
}
</script>

<style lang="css">
.markdown-tekst {
  padding: 20px 32px;
}
.markdown-tekst ul,
.markdown-tekst ol {
  padding-bottom: 16px;
}
.markdown-tekst th,
.markdown-tekst td {
  padding: 2px 6px;
}
.markdown-tekst td {
  padding: 2px 6px;
}
.markdown-tekst table {
  margin-bottom: 16px;
}
.markdown-tekst table th,
.markdown-tekst table td {
  border: 1px solid grey;
}
.markdown-tekst table {
  border-collapse: collapse;
}
.markdown-tekst img {
  width: 640px;
}
</style>
