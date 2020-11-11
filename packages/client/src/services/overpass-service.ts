import { NominatimResult, OverpassResult } from "../models";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import query_overpass from "query-overpass";
// const overpass = require("overpass-frontend");
import queryString from "query-string";
import { bbox, buffer, center } from "@turf/turf";
import Axios from "axios";

export default class OverpassService {
  private nominatim;
  private overpass: (query: string, cb: (...args: any) => void, options?: any) => void;

  constructor() {
    this.nominatim = "https://nominatim.openstreetmap.org/search?limit=10&";
    this.overpass = query_overpass;
  }

  public async getGeojsonFromCoordinates(coordinates: number[], type: string, callbackFcn: (...args: any) => any) {
    const f: Feature<Point> = this.createFeature(coordinates, {});
    const buffered = buffer(f, 5, { units: "kilometers" });
    const bufferBox = bbox(buffered);
    const queryBox = {
      minlat: +bufferBox[0],
      minlon: +bufferBox[1],
      maxlat: +bufferBox[2],
      maxlon: +bufferBox[3],
    };
    this.getGeojson(queryBox, type, callbackFcn);
  }

  public async getGeojsonFromQuery(name: string, type: string, callbackFcn: (fc: FeatureCollection<Point>) => void) {
    const query = queryString.stringify({ q: name, format: "json" });
    const aresult = await Axios.get(`${this.nominatim}${query}`);
    const result: NominatimResult[] = aresult.data;
    if (!result || !result.length) {
      console.warn(`Nothing found for ${name}`);
      return;
    }
    const found: NominatimResult = result.shift()!;
    // const foundBbox = {
    //   minlat: +found.boundingbox[0],
    //   maxlat: +found.boundingbox[1],
    //   minlon: +found.boundingbox[2],
    //   maxlon: +found.boundingbox[3],
    // };
    const buffered = buffer(center(this.createFeature([+found.lat, +found.lon], {})), 5, { units: "kilometers" });
    const bufferBox = bbox(buffered);
    const queryBox = {
      minlat: +bufferBox[0],
      minlon: +bufferBox[1],
      maxlat: +bufferBox[2],
      maxlon: +bufferBox[3],
    };
    this.getGeojson(queryBox, type, callbackFcn);
  }

  private async getGeojson(bb: any, type: string, cb: (...args: any) => any) {
    const q =
      `[out:json];(` +
      `node(${bb.minlat},${bb.minlon},${bb.maxlat},${bb.maxlon})[${type}];` +
      `way(${bb.minlat},${bb.minlon},${bb.maxlat},${bb.maxlon})[${type}];` +
      `relation(${bb.minlat},${bb.minlon},${bb.maxlat},${bb.maxlon})[${type}];` +
      `);out center 10;`;
    console.log(q);
    this.overpass(q, (error: Error | undefined, fc: FeatureCollection<Point>) => {
      if (error) {
        console.log(error);
        cb({ type: "FeatureCollection", features: [] } as FeatureCollection);
      } else {
        console.log(fc);
        fc.features.forEach(f => f.properties ? delete f.properties.geometry : undefined);
        cb(fc);
      }
    });
  }

  private createFeature(coords: number[], props: GeoJsonProperties): Feature<Point, GeoJsonProperties> {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coords,
      },
      properties: {
        name: props && props["tags"] ? props["tags"]["name"] || "?" : "?",
      },
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
