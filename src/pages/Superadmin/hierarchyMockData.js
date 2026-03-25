export const zonalManagers = [
  { id: "69646e8d6b2c172505713598", name: "Kamal Uddin" },
  { id: "69646e8d6b2c172505713599", name: "Nasima Rahman" },
  { id: "69646e8d6b2c172505713600", name: "Fahim Chowdhury" },
];

export const areaManagers = [
  { id: "695b603cb8746a020eafef87", name: "Sabbir Hasan" },
  { id: "695b603cb8746a020eafef88", name: "Afsana Sultana" },
  { id: "695b603cb8746a020eafef89", name: "Nadim Hasan" },
  { id: "695b603cb8746a020eafef90", name: "Priya Dutta" },
];

export const initialZones = [
  {
    id: "698424ea22758a7e1d6f037a",
    name: "Dhaka-A",
    zonalManagerId: "69646e8d6b2c172505713598",
  },
  {
    id: "698424ea22758a7e1d6f037b",
    name: "Dhaka-B",
    zonalManagerId: "69646e8d6b2c172505713599",
  },
  {
    id: "698424ea22758a7e1d6f037c",
    name: "Chattogram-A",
    zonalManagerId: "69646e8d6b2c172505713600",
  },
];

export const initialAreas = [
  {
    id: "698426e1b3726914c3e8a42e",
    areaName: "Area 1",
    zoneId: "698424ea22758a7e1d6f037a",
    areaManagerId: "695b603cb8746a020eafef87",
  },
  {
    id: "698426e1b3726914c3e8a42f",
    areaName: "Area 2",
    zoneId: "698424ea22758a7e1d6f037a",
    areaManagerId: "695b603cb8746a020eafef88",
  },
  {
    id: "698426e1b3726914c3e8a430",
    areaName: "Area 3",
    zoneId: "698424ea22758a7e1d6f037b",
    areaManagerId: "695b603cb8746a020eafef89",
  },
  {
    id: "698426e1b3726914c3e8a431",
    areaName: "Area 4",
    zoneId: "698424ea22758a7e1d6f037c",
    areaManagerId: "695b603cb8746a020eafef90",
  },
];

export const initialTerritories = [
  {
    id: "698429c4dfb91f15ab85032d",
    territoryName: "Mirpur-1",
    areaId: "698426e1b3726914c3e8a42e",
  },
  {
    id: "698429c4dfb91f15ab85032e",
    territoryName: "Mirpur-2",
    areaId: "698426e1b3726914c3e8a42e",
  },
  {
    id: "698429c4dfb91f15ab85032f",
    territoryName: "Uttara-5",
    areaId: "698426e1b3726914c3e8a42f",
  },
  {
    id: "698429c4dfb91f15ab850330",
    territoryName: "Shibpur",
    areaId: "698426e1b3726914c3e8a430",
  },
  {
    id: "698429c4dfb91f15ab850331",
    territoryName: "Comilla Sadar",
    areaId: "698426e1b3726914c3e8a431",
  },
];

export const initialMarketPoints = [
  { id: "mp-001", name: "rainkhola bazar", territoryId: "698429c4dfb91f15ab85032d" },
  { id: "mp-002", name: "d block bazar", territoryId: "698429c4dfb91f15ab85032d" },
  { id: "mp-003", name: "mirpur 2 bus stand", territoryId: "698429c4dfb91f15ab85032e" },
  { id: "mp-004", name: "uttara sector 5 market", territoryId: "698429c4dfb91f15ab85032f" },
  { id: "mp-005", name: "shibpur rail gate", territoryId: "698429c4dfb91f15ab850330" },
  { id: "mp-006", name: "comilla kandirpar", territoryId: "698429c4dfb91f15ab850331" },
  { id: "mp-007", name: "comilla town hall bazar", territoryId: "698429c4dfb91f15ab850331" },
];

export const zoneCreatePayloadExample = {
  name: "Dhaka-A",
  zonalManagerId: "69646e8d6b2c172505713598",
};

export const areaCreatePayloadExample = {
  areaName: "Area 2",
  zoneId: "698424ea22758a7e1d6f037a",
  areaManagerId: "695b603cb8746a020eafef87",
};

export const territoryCreatePayloadExample = {
  territoryName: "Mirpur-1",
  areaId: "698426e1b3726914c3e8a42e",
};
