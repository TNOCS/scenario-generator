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
import _, { cloneDeep, random, range } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { createStyle } from "vuelayers/lib/ol-ext/style";
import { Map } from "vuelayers";

@Component({
  components: {},
})
export default class MapCard extends Vue {
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

  private async updateMap() {
    console.log(`Get map data`);
    const features = _.chain([1, 2, 3, 4])
      .map((d) => {
        const coords = [Math.random() * 40, Math.random() * 40];
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
          properties: {
            test: "Test " + d,
          },
        };
      })
      .filter((f) => !!f)
      .value();

    setTimeout(() => {
      this.features = features;
    }, 20);
    console.log(`Got map data`);
  }

  async mounted() {
    setTimeout(() => this.updateMap(), 250);
  }
}
</script>

<style lang="css">
.full-height {
  height: 100%;
}
</style>
