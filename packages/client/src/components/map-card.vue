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
      <div class="pr-cir">
        <v-progress-circular indeterminate :size="150" color="primary" v-if="loading"></v-progress-circular>
      </div>
      <v-row class="no-gutters full-height">
        <v-col md="12" class="full-height">
          <div class="map-overlay-coords">{{ pointer }}</div>
          <vl-map
            :load-tiles-while-animating="true"
            :load-tiles-while-interacting="true"
            @pointermove="pointerMove"
            data-projection="EPSG:4326"
            style="height: 85%"
          >
            <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>

            <vl-layer-tile id="xyz">
              <vl-source-xyz :url="url"></vl-source-xyz>
            </vl-layer-tile>

            <vl-layer-vector :z-index="99">
              <!-- <vl-source-vector :features.sync="features"></vl-source-vector> -->
              <vl-source-vector :features="features">
                <!-- <vl-feature v-for="(f, idx) in features" :key="`f${idx}`" :id="`f${idx}`" :properties="f.properties"> -->
                <!-- <vl-geom-point :coordinates="f.geometry.coordinates"></vl-geom-point> -->
                <vl-style-box>
                  <!-- <vl-style-circle :radius="10">
                      <vl-style-fill :color="[255, 20, 22, 0.8]"></vl-style-fill>
                      <vl-style-stroke :color="[20, 250, 22, 0.8]"></vl-style-stroke>
                    </vl-style-circle> -->
                  <vl-style-icon :src="iconUrl" :scale="0.8" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
                <!-- </vl-feature> -->
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
import { bbox, bboxPolygon, center } from "@turf/turf";
import { IContent, IContext, INarrative, IScenario, LocationContext } from "../models";
import { ICollectionRecord } from "../services/meiosis";
import { CollectionType } from "../services/states/collection-state";

const ICON_URL: string = "https://github.com/rinzeb/osm-icons/raw/master/png/osm{{ITEM}}.png";

@Component({
  components: {},
})
export default class MapCard extends Vue {
  private narrative: INarrative = {} as INarrative;
  private scenario: Partial<IScenario> = {};
  private locations: CollectionType<IContent> = {};
  private typeOfObjects: CollectionType<IContent> = {};
  private iconUrl: string = "https://github.com/rinzeb/osm-icons/raw/master/png/osmairport.png";
  private loading: boolean = false;

  private url: string = "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  private urls: string[] = [
    "https://{a-c}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
    "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ];
  private zoom: number = 2;
  private center: number[] = [0, 12];
  private features: any[] = [];
  private pointer: string = "";

  @Watch("narrative")
  private narrChanged() {
    this.updateMap();
  }

  private toggleMapLayer() {
    if (this.url === this.urls[0]) {
      this.url = this.urls[1];
    } else {
      this.url = this.urls[0];
    }
  }

  private getIcon(n: INarrative): string {
    let result = "building";
    if (n && n.components) {
      const typeId = _.pick(n.components, "TypeOfObject");
      const type = typeId && _.find(this.typeOfObjects.list!, val => val.id === typeId.TypeOfObject);
      const typeContext: IContext | undefined = type && type.context;
      if (typeContext) {
        result = `${Object.values(typeContext.data).pop()!}`;
      }
    }
    return ICON_URL.replace("{{ITEM}}", result);
  }

  private zoomMap = _.throttle(this.zoomMapThrottled, 500, { trailing: true });

  private zoomMapThrottled() {
    if (!this.features || this.features.length < 1) return;
    let c: Feature<any>;
    if (this.features.length === 1) {
      c = this.features[0];
    } else {
      c = center(bboxPolygon(bbox({ type: "FeatureCollection", features: this.features } as FeatureCollection<any, any>)));
    }
    if (c && c.geometry && c.geometry.coordinates) {
      this.center = [c.geometry.coordinates[0], c.geometry.coordinates[1]];
      this.zoom = 14;
    }
  }

  private pointerMove = _.throttle(this.pointerMoveThrottled, 50, { trailing: true });

  private pointerMoveThrottled(evt: any) {
    this.pointer = `Lat: ${evt.coordinate[1].toFixed(4)}, Lon: ${evt.coordinate[0].toFixed(4)}`;
  }

  private addFeatures(fc: FeatureCollection<Point>) {
    this.loading = false;
    console.log(`Received ${fc.features.length} features`);
    const features: Feature<Point>[] = [];
    fc.features.forEach(f => {
      features.push(f);
    });
    setTimeout(() => {
      Vue.set(this, "features", features);
      this.zoomMap();
    }, 100);
  }

  private updateMap = _.debounce(this.updateMapThrottled, 500);

  private updateMapThrottled() {
    console.log(`Update map data`);
    this.loading = true;
    if (this.features.length > 0) {
      this.features.splice(0, this.features.length);
    }
    if (this.narrative && this.narrative.id) {
      const locId = _.pick(this.narrative.components, "Location");
      const loc = locId && _.find(this.locations.list!, val => val.id === locId.Location);
      const locContext: IContext | undefined = loc && loc.context;
      if (!locContext) {
        this.loading = false;
        this.$store.actions.notify(this.$t(`APP.NO_LOCATION_CONTEXT`).toString());
        return console.log(`Could not find loc in narrative ${this.narrative.name}`);
      }
      const typeId = _.pick(this.narrative.components, "TypeOfObject");
      const type = typeId && _.find(this.typeOfObjects.list!, val => val.id === typeId.TypeOfObject);
      const typeContext: IContext | undefined = type && type.context;
      if (!typeContext) {
        this.loading = false;
        this.$store.actions.notify(this.$t(`APP.NO_LOCATION_TYPE_CONTEXT`).toString());
        return console.log(`Could not find typeOfObject in narrative ${this.narrative.name}`);
      }
      const amenity = `${Object.keys(typeContext.data).pop()!}=${Object.values(typeContext.data).pop()!}`;
      if (locContext.type === "LOCATION") {
        const data = locContext.data as LocationContext;
        if (data.hasOwnProperty("NAME")) {
          this.$overpass.getGeojsonFromQuery(data.NAME || loc!.name!, amenity, this.addFeatures);
        } else if (data.hasOwnProperty("COORDINATES")) {
          const coords = data.COORDINATES.split(",").map(c => +c);
          this.$overpass.getGeojsonFromCoordinates(coords, amenity, this.addFeatures);
        }
      } else {
        this.$store.actions.notify(this.$t(`APP.NO_LOCATION_CONTEXT`).toString());
        console.log("No location context found");
        this.loading = false;
      }
    }
  }

  private init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current!;
      this.locations = s.Location;
      this.typeOfObjects = s.TypeOfObject;
      this.narrative = s.app.narrative || ({} as INarrative);
      this.iconUrl = this.getIcon(s.app.narrative);
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
.map-overlay-coords {
  position: absolute;
  text-align: center;
  top: 6px;
  width: 100%;
  z-index: 100;
  pointer-events: none;
}
.pr-cir {
  position: absolute;
  width: 100%;
  text-align: center;
  align-self: center;
  justify-content: center;
  top: 100px;
  z-index: 1000;
}
</style>
