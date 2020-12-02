export type OsmType = { name: string; key: string; value: string };

export const OsmTypes: OsmType[] = [
  { name: "Restaurant", key: "amenity", value: "restaurant" },
  { name: "Cafe", key: "amenity", value: "bar" },
  { name: "Gas station", key: "amenity", value: "fuel" },
  { name: "Parking", key: "amenity", value: "parking" },
  { name: "Church", key: "building", value: "church" },
  { name: "Airport", key: "aeroway", value: "aerodrome" },
  { name: "Flats", key: "\"building:levels\"", value: "\"([6-9]|\d{2,})\"" },
  { name: "Hotel", key: "tourism", value: "hotel" },
  { name: "Stadspoort", key: "historic", value: "city_gate" },
  { name: "Standbeeld", key: "memorial", value: "statue" },
];
