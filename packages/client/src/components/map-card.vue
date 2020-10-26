<template>
  <v-card flat tile class="flex-card" style="background: transparent">
    <div class="overline px-2 py-0">
      {{ $tc("APP.LOCATION") }}
      <span style="float: right">
        <v-btn icon @click="toggleMapLayer"><v-icon>mdi-map</v-icon></v-btn>
      </span>
    </div>
    <v-divider />
    <v-card-text class="text-description full-height">
      <v-row class="no-gutters full-height">
        <v-col md="12" class="full-height">
          <vl-map
            :load-tiles-while-animating="true"
            :load-tiles-while-interacting="true"
            data-projection="EPSG:4326"
            style="height: 85%"
          >
            <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>

            <vl-layer-tile id="xyz">
              <vl-source-xyz :url="url"></vl-source-xyz>
            </vl-layer-tile>

            <vl-layer-vector :z-index="99">
              <!-- <vl-source-vector :features.sync="features"></vl-source-vector> -->
              <vl-source-vector>
                <vl-feature v-for="(f, idx) in features" :key="`f${idx}`" :id="`f${idx}`" :properties="f.properties">
                  <vl-geom-point :coordinates="f.geometry.coordinates"></vl-geom-point>
                  <vl-style-box>
                    <vl-style-circle :radius="10">
                      <vl-style-fill :color="[255, 20, 22, 0.8]"></vl-style-fill>
                      <vl-style-stroke :color="[20, 250, 22, 0.8]"></vl-style-stroke>
                    </vl-style-circle>
                  </vl-style-box>
                </vl-feature>
              </vl-source-vector>
            </vl-layer-vector>
          </vl-map>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import _, { cloneDeep, random, range, throttle } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { createStyle } from "vuelayers/lib/ol-ext/style";
import { Map } from "vuelayers";
import { Feature, FeatureCollection, Point } from "geojson";
import center from "@turf/center";
import { IContent, IContext, INarrative, IScenario } from "../models";
import { ICollectionRecord } from "../services/meiosis";
import { CollectionType } from "../services/states/collection-state";

@Component({
  components: {},
})
export default class MapCard extends Vue {
  private scenario: Partial<IScenario> = {};
  private locations: CollectionType<IContent> = {};

  private url: string = "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  private urls: string[] = [
    "https://{a-c}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
    "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ];
  private zoom: number = 2;
  private center: number[] = [0, 12];
  private features: any[] = [];

  private toggleMapLayer() {
    if (this.url === this.urls[0]) {
      this.url = this.urls[1];
    } else {
      this.url = this.urls[0];
    }
  }

  private zoomMap = _.throttle(this.zoomMapThrottled, 500);

  private zoomMapThrottled() {
    if (!this.features) return;
    const c: Feature<any> = center({ type: "FeatureCollection", features: this.features } as FeatureCollection<any, any>);
    this.center = [c.geometry.coordinates[0], c.geometry.coordinates[1]];
    this.zoom = 14;
  }

  private async addFeature(f: Feature<Point>) {
    this.features.push(f);
    this.zoomMap();
  }

  private async updateMap() {
    console.log(`Request map data`);
    if (this.scenario && this.scenario.narratives && this.scenario.narratives.length > 0) {
      const n: INarrative | undefined = this.scenario.narratives[0];
      if (!n) return;
      const l = _.pick(n.components, "Location");
      if (!l) return;
      const loc = _.find(this.locations.list!, (val) => val.name === l.Location);
      if (!loc) return;
      const data = this.$overpass.getGeojson(Object.values(loc!.context!.data)[0], this.addFeature);
    }
  }

  private init() {
    this.$store.states.map((s) => {
      this.scenario = s.scenarios.current!;
      this.locations = s.Location;
    });
  }

  async mounted() {
    this.init();
    setTimeout(() => this.updateMap(), 250);
  }
}
</script>

<style lang="css">
.full-height {
  height: 100%;
}
</style>
