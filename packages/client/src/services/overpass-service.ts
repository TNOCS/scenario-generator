import { NominatimResult, OverpassResult } from "../models";
import { Feature, Point } from "geojson";
// import overpass from "overpass-frontend";
const overpass = require("overpass-frontend");
import queryString from "query-string";
import Axios from "axios";

export default class OverpassService {
  private nominatim;
  private overpass;
  private callbackFcn?: (...args: any) => any;

  constructor() {
    this.nominatim = "https://nominatim.openstreetmap.org/search?";
    this.overpass = new overpass("//overpass-api.de/api/interpreter");
  }

  public async getGeojson(name: string, callbackFcn: (...args: any) => any) {
    const query = queryString.stringify({ q: name, format: "json" });
    const aresult = await Axios.get(`${this.nominatim}${query}`);
    const result: NominatimResult[] = aresult.data;
    if (!result || !result.length) {
      console.warn(`Nothing found for ${name}`);
      return;
    }
    const found: NominatimResult = result.shift()!;
    this.callbackFcn = callbackFcn;
    const data = this.overpass.BBoxQuery(
      "nwr[amenity=restaurant]",
      //   { minlat: 48.195, maxlat: 48.2, minlon: 16.335, maxlon: 16.34 },
      {
        minlat: +found.boundingbox[0],
        maxlat: +found.boundingbox[1],
        minlon: +found.boundingbox[2],
        maxlon: +found.boundingbox[3],
      },
      {
        properties: overpass.ALL,
      },
      (err: Error, result: OverpassResult) => {
        console.log("* " + result.tags.name + " (" + result.id + ")");
        const geoJson: Feature<Point> = this.createFeature(result);
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

  private createFeature(result: OverpassResult): Feature<Point> {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [result.center.lon, result.center.lat],
      },
      properties: Object.assign(
        {
          id: result.id,
        },
        result.tags
      ),
    };
  }
}
