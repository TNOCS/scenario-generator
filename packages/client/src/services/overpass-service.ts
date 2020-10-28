import { NominatimResult, OverpassResult } from "../models";
import { Feature, GeoJsonProperties, Point } from "geojson";
// import overpass from "overpass-frontend";
const overpass = require("overpass-frontend");
import queryString from "query-string";
import { bbox, buffer } from "@turf/turf";
import Axios from "axios";

export default class OverpassService {
  private nominatim;
  private overpass;
  private callbackFcn?: (...args: any) => any;

  constructor() {
    this.nominatim = "https://nominatim.openstreetmap.org/search?limit=10&";
    this.overpass = new overpass("//overpass-api.de/api/interpreter");
  }

  public async getGeojsonFromCoordinates(coordinates: number[], callbackFcn: (...args: any) => any) {
    const f: Feature<Point> = this.createFeature(coordinates, {});
    const buffered = buffer(f, 2, { units: "kilometers" });
    const bufferBox = bbox(buffered);
    const queryBox = {
      minlat: +bufferBox[0],
      minlon: +bufferBox[1],
      maxlat: +bufferBox[2],
      maxlon: +bufferBox[3],
    };
    this.getGeojson(queryBox, callbackFcn);
  }

  public async getGeojsonFromQuery(name: string, callbackFcn: (...args: any) => any) {
    const query = queryString.stringify({ q: name, format: "json" });
    const aresult = await Axios.get(`${this.nominatim}${query}`);
    const result: NominatimResult[] = aresult.data;
    if (!result || !result.length) {
      console.warn(`Nothing found for ${name}`);
      return;
    }
    const found: NominatimResult = result.shift()!;
    const foundBbox = {
      minlat: +found.boundingbox[0],
      maxlat: +found.boundingbox[1],
      minlon: +found.boundingbox[2],
      maxlon: +found.boundingbox[3],
    };
    this.getGeojson(foundBbox, callbackFcn);
  }

  private async getGeojson(bbox: any, callbackFcn: (...args: any) => any) {
    this.callbackFcn = callbackFcn;
    const data = this.overpass.BBoxQuery(
      "nwr[amenity=restaurant]",
      //   { minlat: 48.195, maxlat: 48.2, minlon: 16.335, maxlon: 16.34 },
      bbox,
      {
        properties: overpass.ALL,
      },
      (err: Error, result: OverpassResult) => {
        console.log("* " + result.tags.name + " (" + result.id + ")");
        const geoJson: Feature<Point> = this.createFeatureOverpass(result);
        if (this.callbackFcn) {
          this.callbackFcn(geoJson);
        }
      },
      (err: Error) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  private createFeature(coords: number[], props: GeoJsonProperties): Feature<Point, GeoJsonProperties> {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coords,
      },
      properties: props,
    };
  }

  private createFeatureOverpass(result: OverpassResult): Feature<Point> {
    return this.createFeature(
      [result.center.lon, result.center.lat],
      Object.assign(
        {
          id: result.id,
        },
        result.tags
      )
    );
  }
}
