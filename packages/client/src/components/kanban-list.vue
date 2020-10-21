<template>
  <v-card dense flat tile class="flex-card" color="secondary">
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="2" class="py-2 pl-3 divider-r">
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
          <div class="text-description px-2">
            <Container orientation="horizontal">
              <Draggable v-for="(item, id) in items" :key="id">
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
import { lightFormat } from "date-fns";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Container, Draggable } from "vue-smooth-dnd";
import { IContent } from "../models";
import { CollectionNames } from "../services/meiosis";
import { getUuid } from "../utils/constants";
import KanbanCard from "./kanban-card.vue";
import AddComponentCard from "./add-component-card.vue";

@Component({
  components: { Container, Draggable, KanbanCard, AddComponentCard },
})
export default class KanbanList extends Vue {
  @Prop({ default: "" }) public itemkey!: CollectionNames;
  private items: Partial<IContent>[] = [];
  private title: string = "";
  private menu: boolean = false;

  @Watch("itemkey")
  private itemkeyChanged() {
    this.init();
  }

  constructor() {
    super();
  }

  private async init() {
    if (!this.itemkey || !this.itemkey.length) return;
    this.title = this.$tc(`COMP.${this.itemkey.toLocaleUpperCase()}`, 2);
    await this.$store.actions[this.itemkey].updateList();
    this.$store.states.map((s) => {
      this.items = s[this.itemkey].list!;
    });
  }

  private async closeMenu() {
    this.menu = false;
  }

  mounted() {
    console.log(`KanbanList mounted`);
    this.init();
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
</style>
