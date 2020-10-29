export type OsmType = { name: string; key: string; value: string };

export const OsmTypes: OsmType[] = [
  { name: "Restaurant", key: "amenity", value: "restaurant" },
  { name: "Cafe", key: "amenity", value: "bar" },
  { name: "Gas station", key: "amenity", value: "fuel" },
  { name: "Parking", key: "amenity", value: "parking" },
  { name: "Church", key: "building", value: "church" },
  { name: "Airport", key: "aeroway", value: "aerodrome" },
  { name: "Hotel", key: "tourism", value: "hotel" },
];
