import { NominatimResult, OverpassResult } from "../models";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import query_overpass from "query-overpass";
// const overpass = require("overpass-frontend");
import queryString from "query-string";
import { bbox, buffer, center } from "@turf/turf";
import Axios from "axios";

const FIRST_SEARCH_CIRCLE_KM = 1.5;
const SECOND_SEARCH_CIRCLE_KM = 5;

export default class OverpassService {
  private nominatim;
  private overpass: (query: string, cb: (...args: any) => void, options?: any) => void;

  constructor() {
    this.nominatim = "https://nominatim.openstreetmap.org/search?limit=10&";
    this.overpass = query_overpass;
  }

  private getQueryboxFromCoordinates(coordinates: number[], searchKm: number) {
    const f: Feature<Point> = this.createFeature(coordinates, {});
    const buffered = buffer(f, searchKm, { units: "kilometers" });
    const bufferBox = bbox(buffered);
    return {
      minlat: +bufferBox[0],
      minlon: +bufferBox[1],
      maxlat: +bufferBox[2],
      maxlon: +bufferBox[3],
    };
  }

  public async getGeojsonFromCoordinates(coordinates: number[], type: string, callbackFcn: (...args: any) => any) {
    let queryBox = this.getQueryboxFromCoordinates(coordinates, FIRST_SEARCH_CIRCLE_KM);
    this.getGeojson(queryBox, type, (fc: FeatureCollection<Point>) => {
      if (!fc || !fc.features || fc.features.length === 0) {
      console.log(`Extending search radius to ${SECOND_SEARCH_CIRCLE_KM}`);
      queryBox = this.getQueryboxFromCoordinates(coordinates, SECOND_SEARCH_CIRCLE_KM);
        this.getGeojson(queryBox, type, callbackFcn);
      } else {
        callbackFcn(fc);
      }
    });
  }

  private getQueryboxFromQuery(found: NominatimResult, searchKm: number) {
    const buffered = buffer(center(this.createFeature([+found.lat, +found.lon], {})), searchKm, { units: "kilometers" });
    const bufferBox = bbox(buffered);
    return {
      minlat: +bufferBox[0],
      minlon: +bufferBox[1],
      maxlat: +bufferBox[2],
      maxlon: +bufferBox[3],
    };
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
    let queryBox = this.getQueryboxFromQuery(found, FIRST_SEARCH_CIRCLE_KM);
    this.getGeojson(queryBox, type, (fc: FeatureCollection<Point>) => {
      if (!fc || !fc.features || fc.features.length === 0) {
      console.log(`Extending search radius to ${SECOND_SEARCH_CIRCLE_KM}`);
      queryBox = this.getQueryboxFromQuery(found, SECOND_SEARCH_CIRCLE_KM);
        this.getGeojson(queryBox, type, callbackFcn);
      } else {
        callbackFcn(fc);
      }
    });
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
        fc.features.forEach(f => {
          f.properties = f.properties || {};
          delete f.properties.geometry;
          f.properties.name = f.properties["tags"] ? f.properties["tags"]["name"] || "?" : "?";
        });
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
