<template>
  <v-card dense flat tile class="flex-card" color="secondary">
    <v-card-text v-if="verticalDirection">
      <v-row no-gutters>
        <v-col cols="9">
          <span class="title text-truncate">{{ title | capitalize }}</span>
        </v-col>
        <v-col cols="3">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" color="accent darken-1" fab small elevation="2" class="ml-4">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <AddComponentCard :itemkey="itemkey" @close="closeMenu"></AddComponentCard>
          </v-menu>
        </v-col>
        <v-col cols="12" class="py-1 pl-1">
          <div class="text-description px-2 hor-overflow">
            <Container orientation="vertical">
              <Draggable v-for="(item, id) in items" :key="id" class="min-width-card">
                <KanbanCard :item="item" />
              </Draggable>
            </Container>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-if="!verticalDirection">
      <v-row no-gutters>
        <v-col cols="2" class="py-2 pl-0 divider-r">
          <span class="title">{{ title | capitalize }}</span>
          <v-spacer />
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" color="accent darken-1" fab small elevation="2" class="mr-4 add-button">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <AddComponentCard :itemkey="itemkey" @close="closeMenu"></AddComponentCard>
          </v-menu>
        </v-col>
        <v-col cols="10" class="py-1 pl-1">
          <div class="text-description px-2 hor-overflow">
            <Container orientation="horizontal">
              <Draggable v-for="(item, id) in items" :key="id" class="min-width-card">
                <KanbanCard :item="item" />
              </Draggable>
            </Container>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Container, Draggable } from 'vue-smooth-dnd';
import { IContent } from '../models';
import { CollectionNames } from '../services/meiosis';
import KanbanCard from './kanban-card.vue';
import AddComponentCard from './add-component-card.vue';

@Component({
  components: { Container, Draggable, KanbanCard, AddComponentCard },
})
export default class KanbanList extends Vue {
  @Prop({ default: '' }) public itemkey!: CollectionNames;
  @Prop({ default: false }) private readonly verticalDirection!: boolean;
  private items: Partial<IContent>[] = [];
  private title = '';
  private language = '';
  private menu = false;

  @Watch('itemkey')
  private itemkeyChanged() {
    this.init();
  }

  @Watch('language')
  private languageChanged() {
    this.setTitle();
  }

  constructor() {
    super();
  }

  private async setTitle() {
    if (!this.itemkey || !this.itemkey.length) return;
    this.title = this.$tc(`COMP.${this.itemkey.toLocaleUpperCase()}`, 2);
  }

  private async init() {
    if (!this.itemkey || !this.itemkey.length) return;
    this.setTitle();
    await this.$store.actions[this.itemkey].updateList();
    this.$store.states.map(s => {
      this.items = s[this.itemkey].list || [];
      this.language = s.app.language;
    });
  }

  private async closeMenu() {
    this.menu = false;
  }

  async mounted(): Promise<void> {
    console.log(`KanbanList mounted`);
    await this.init();
  }
}
</script>

<style scoped lang="css">
.kanban-menu {
  padding: 8px 16px;
}
.add-button {
  float: right;
}
.theme--light .divider-r {
  border-right: lightgray 1px solid;
}
.theme--dark .divider-r {
  border-right: rgb(80, 80, 80) 1px solid;
}
.min-width-card {
  min-width: 180px;
}
.hor-overflow {
  overflow-x: auto;
}
</style>
