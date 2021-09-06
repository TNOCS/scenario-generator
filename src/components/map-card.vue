<template>
  <v-card flat tile class="flex-card map-full-height map-full-width no-background" style="min-height: 500px">
    <div class="overline pl-6 pr-2 pb-0 pt-1">
      {{ $tc('APP.LOCATION') }}
      <v-tooltip left open-delay="1000">
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs" style="float: right">
            <v-btn icon @click="toggleMapLayer"><v-icon>mdi-map</v-icon></v-btn>
          </span>
        </template>
        <span>{{ $t('APP.TOGGLE_MAP_BASE') | capitalize }}</span>
      </v-tooltip>
    </div>
    <div class="map-card-height map-card-full-width">
      <div class="pr-cir" v-if="loading">
        <v-progress-circular indeterminate :size="150" color="primary"></v-progress-circular>
      </div>
      <div class="map-overlay-coords">{{ pointer }}</div>
      <vl-map
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        @pointermove="pointerMove"
        @click="mapClick"
        @postrender="mapRendered"
        data-projection="EPSG:4326"
        style="height: 100%"
      >
        <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>

        <!-- selected feature popup -->
        <vl-interaction-select v-if="active">
          <!-- prettier-ignore -->
          <vl-overlay v-if="active.id_" :key="active.id_" :id="active.id_" :position="pointOnSurface(active.getGeometry())" :offset="[2, 2]">
            <p class="cardcontent" @click="closePopup" :auto-pan="true">
              <strong>{{ active.get('name') }}</strong>
            </p>
          </vl-overlay>
        </vl-interaction-select>

        <vl-layer-tile id="xyz">
          <vl-source-xyz :url="url"></vl-source-xyz>
        </vl-layer-tile>

        <vl-layer-vector :z-index="99">
          <!-- <vl-source-vector :features.sync="features"></vl-source-vector> -->
          <vl-source-vector :features="features">
            <!-- <vl-feature v-for="(f, idx) in features" :key="`f${idx}`" :id="`f${idx}`" :properties="f.properties"> -->
            <!-- <vl-geom-point :coordinates="f.geometry.coordinates"></vl-geom-point> -->
            <vl-style-box>
              <vl-style-circle :radius="10">
                <vl-style-fill :color="[255, 20, 22, 0.8]"></vl-style-fill>
                <vl-style-stroke :color="[20, 250, 22, 0.8]"></vl-style-stroke>
              </vl-style-circle>
              <vl-style-icon :src="iconUrl" :scale="0.8" :anchor="[0.5, 0.5]"></vl-style-icon>
            </vl-style-box>
          </vl-source-vector>
        </vl-layer-vector>

        <vl-layer-vector :z-index="98">
          <!-- <vl-source-vector :features.sync="features"></vl-source-vector> -->
          <vl-source-vector :features="features">
            <!-- <vl-feature v-for="(f, idx) in features" :key="`f${idx}`" :id="`f${idx}`" :properties="f.properties"> -->
            <!-- <vl-geom-point :coordinates="f.geometry.coordinates"></vl-geom-point> -->
            <vl-style-box>
              <vl-style-circle :radius="24">
                <vl-style-fill :color="[20, 20, 252, 0.1]"></vl-style-fill>
                <vl-style-stroke :color="[255, 255, 255, 0.8]" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-source-vector>
        </vl-layer-vector>
      </vl-map>
    </div>
  </v-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import { pick, find, throttle, debounce } from 'lodash';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { pointToLonLat } from 'vuelayers/lib/ol-ext';
import { Feature, FeatureCollection, Point } from 'geojson';
import { bbox, bboxPolygon, center } from '@turf/turf';
import { IContent, IContext, INarrative, IScenario, LocationContext, NominatimResult } from '../models';
import { CollectionType } from '../services/states/collection-state';

const ICON_URL = 'https://github.com/rinzeb/osm-icons/raw/master/png/osm{{ITEM}}.png';

@Component({
  components: {},
})
export default class MapCard extends Vue {
  private narrative: INarrative = {} as INarrative;
  private scenario: Partial<IScenario> = {};
  private locations: CollectionType<IContent> = {};
  private typeOfObjects: CollectionType<IContent> = {};
  private iconUrl = 'https://github.com/rinzeb/osm-icons/raw/master/png/osmairport.png';
  private loading = false;

  private url = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private urls: string[] = [
    'https://{a-c}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ];
  private zoom = 8;
  private center: [number, number] = [5.2, 52.3];
  private features: any[] = [];
  private pointer = '';
  private active: any = null;
  private initialized = false;
  private map?: any;

  @Watch('narrative')
  private narrChanged() {
    this.updateMap();
  }

  private mapClick($evt: any) {
    this.toggleFeature($evt.pixel, $evt.map);
  }

  private toggleFeature(pixel: any, map: any) {
    let _doneOne = false;
    map.forEachFeatureAtPixel(pixel, (f: any) => {
      if (_doneOne) return;
      if (this.active && this.active.id_ == f.id_) {
        this.active = null;
        _doneOne = true;
      } else {
        this.active = f;
        _doneOne = true;
      }
      console.log(`Open/close ${f.get('name')}`);
    });
    if (!_doneOne) {
      this.active = null;
    }
  }

  private mapRendered($evt: any) {
    if (!this.initialized) {
      this.map = $evt.map;
      this.map.updateSize();
      this.initialized = true;
    }
  }

  private closePopup($evt: any) {
    this.active = null;
  }

  private pointOnSurface(...args: any) {
    return pointToLonLat(args[0].getCoordinates(), 'EPSG:3857', 'EPSG:4326');
  }

  private toggleMapLayer() {
    if (this.url === this.urls[0]) {
      this.url = this.urls[1];
    } else {
      this.url = this.urls[0];
    }
    this.map.updateSize();
  }

  private getIcon(n: INarrative): string {
    let result = 'building';
    if (n && n.components) {
      const typeId = pick(n.components, 'TypeOfObject');
      const type = typeId && find(this.typeOfObjects.list, val => val.id === typeId.TypeOfObject);
      const typeContext: IContext | undefined = type && type.context;
      if (typeContext) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!Object.keys(typeContext.data).pop()!.includes('levels')) {
          result = `${Object.values(typeContext.data).pop()}`;
        }
      }
    }
    return ICON_URL.replace('{{ITEM}}', result);
  }

  private zoomMap = throttle(this.zoomMapThrottled, 500, { trailing: true });

  private zoomMapThrottled() {
    if (!this.features || this.features.length < 1) return;
    let c: Feature<any>;
    if (this.features.length === 1) {
      c = this.features[0];
    } else {
      c = center(bboxPolygon(bbox({ type: 'FeatureCollection', features: this.features } as FeatureCollection<any, any>)));
    }
    if (c && c.geometry && c.geometry.coordinates) {
      this.center = [c.geometry.coordinates[0], c.geometry.coordinates[1]];
      this.zoom = 14;
    }
  }

  private pointerMove = throttle(this.pointerMoveThrottled, 50, { trailing: true });

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
      Vue.set(this, 'features', features);
      this.zoomMap();
    }, 100);
  }

  private updateMap = debounce(this.updateMapThrottled, 500);

  private updateMapThrottled() {
    console.log(`Update map data`);
    this.loading = true;
    if (this.features.length > 0) {
      this.features.splice(0, this.features.length);
    }
    if (this.narrative && this.narrative.id) {
      const locId = pick(this.narrative.components, 'Location');
      const loc: Partial<IContent> | undefined = locId && find(this.locations.list, val => val.id === locId.Location);
      const locContext: IContext | undefined = loc && loc.context;
      if (!locContext) {
        this.loading = false;
        this.$store.actions.notify(this.$t(`APP.NO_LOCATION_CONTEXT`).toString());
        return console.log(`Could not find loc in narrative ${this.narrative.name}`);
      }
      const typeId = pick(this.narrative.components, 'TypeOfObject');
      const type = typeId && find(this.typeOfObjects.list, val => val.id === typeId.TypeOfObject);
      const typeContext: IContext | undefined = type && type.context;
      if (!typeContext) {
        this.loading = false;
        this.$store.actions.notify(this.$t(`APP.NO_LOCATION_TYPE_CONTEXT`).toString());
        loc && this.getLocationOnly(locContext, loc);
      }
      typeContext && loc && this.getLocationAndLocationTypeResults(typeContext, locContext, loc);
    }
  }

  private getLocationAndLocationTypeResults(typeContext: IContext, locContext: IContext, loc: Partial<IContent>) {
    const amenity = this.getAmenityQuery(typeContext);
    if (locContext.type === 'LOCATION') {
      const data = locContext.data as LocationContext;
      if (data.hasOwnProperty('NAME')) {
        this.$overpass.getGeojsonFromQuery(data.NAME || loc.name || '', amenity, this.addFeatures);
      } else if (data.hasOwnProperty('COORDINATES')) {
        const coords = data.COORDINATES.split(',').map(c => +c);
        this.$overpass.getGeojsonFromCoordinates(coords, amenity, this.addFeatures);
      }
    } else {
      this.$store.actions.notify(this.$t(`APP.NO_LOCATION_CONTEXT`).toString());
      console.log('No location context found');
      this.loading = false;
    }
  }

  private getLocationOnly(locContext: IContext, loc: Partial<IContent>) {
    if (locContext.type === 'LOCATION') {
      const data = locContext.data as LocationContext;
      if (data.hasOwnProperty('NAME')) {
        this.$overpass.getNominatimLocation(data.NAME || loc.name || '').then((result: NominatimResult | undefined) => {
          if (result) {
            this.center = [+result.lon, +result.lat];
            this.zoom = 15;
          }
        });
      } else if (data.hasOwnProperty('COORDINATES')) {
        const coords = data.COORDINATES.split(',').map(c => +c);
        this.center = [coords[1], coords[0]];
        this.zoom = 14;
      }
    } else {
      this.$store.actions.notify(this.$t(`APP.NO_LOCATION_CONTEXT`).toString());
      console.log('No location context found');
      this.loading = false;
    }
  }

  private getAmenityQuery(typeContext: IContext) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (typeContext.data && Object.keys(typeContext.data).pop()!.includes('levels')) {
      return `${Object.keys(typeContext.data).pop()}~${Object.values(typeContext.data).pop()}`;
    } else {
      return `${Object.keys(typeContext.data).pop()}=${Object.values(typeContext.data).pop()}`;
    }
  }

  private init() {
    this.$store.states.map(s => {
      this.scenario = s.scenarios.current || {};
      this.locations = s.Location;
      this.typeOfObjects = s.TypeOfObject;
      this.narrative = s.app.narrative || ({} as INarrative);
      this.iconUrl = this.getIcon(s.app.narrative);
    });
  }

  async mounted(): Promise<void> {
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
  top: 14px;
  width: 100%;
  z-index: 2;
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
.loc-height {
  min-height: 40px;
}
.map-card-height {
  height: calc(100vh - (40px + 40px + 8px));
  padding: 8px;
}
.map-full-width {
  width: 100%;
}
.map-card-full-width {
  width: calc(100% - 20px);
}
.map-full-height {
  height: calc(100vh - (40px + 8px));
}
</style>
