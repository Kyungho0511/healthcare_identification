// user inputs will be stored in the variables below.
// preferedFactors are stored in the order of preference
let preferedFactors = [];
let selectedCounties = "";
let selectedDatasetItems = [];
let selectedVulnerabilityClusters = [];
let selectedProfitabilityClusters = [];
let selectedBuiltEnvironmentClusters = [];
let clusterFeatures = {
  vulnerability: [
    "physical health not good for >=14 days",
    "mental health not good for >=14 days",
    "no leisure-time physical activity",
    "binge drinking",
    "sleeping less than 7 hours",
    "current smoking",
    "current lack of health insurance",
    "visits to dentist or dental clinic",
    "visits to doctor for routine checkup",
  ],
  profitability: [
    "unserved medicaid enrollees / km2",
    "unserved commercial enrollees / km2",
    "insured population / km2",
    "median household disposable income",
    "average land price / ft2",
  ],
  "built environment": [
    "commercial district percent",
    "residential district percent",
    "industrial district percent",
    "agricultural land percent",
    "vacant land percent",
    "drove alone percent",
    "public transit percent",
    "walked percent",
    "worked from home percent",
  ],
};

// Singleton state control for syncMap() function
let isSyncing = false;

// Colors used for mapping
const color = {
  blue: {
    categorized: ["#ebfffe", "#97d9ff", "#3399ff", "#0145ff", "#2500cc"],
    min: "#f7faff",
    max: "#006efe",
  },
  yellow: {
    categorized: ["#d7e317", "#f7e900", "#f9b91b", "#eb6200"],
    min: "#fffaec",
    max: "#f9b91b",
  },
  green: {
    categorized: [],
  },
};

// Config for Map (mapbox)
const config = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  location: {
    center: [-73.970766, 40.713326],
    zoom: 9.8,
    pitch: 0,
    bearing: 0,
  },
  sections: [
    {
      id: "start",
      layers: [
        { layer: "counties-others", opacity: 1 },
        { layer: "counties-nyc", opacity: 1 },
      ],
      default: { attribute: "unserved population / km2", color: color.yellow },
    },
    {
      id: "explore",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 0.8 },
        { layer: "tracts-features-nyc", opacity: 1 },
        { layer: "tracts-features-upstate", opacity: 1 },
      ],
      default: { attribute: "unserved population / km2", color: color.yellow },
    },
    {
      id: "cluster1",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-back-nyc", opacity: 1 },
        { layer: "tracts-back-upstate", opacity: 1 },
      ],
    },
    {
      id: "cluster2",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-back-nyc", opacity: 1 },
        { layer: "tracts-back-upstate", opacity: 1 },
      ],
    },
    {
      id: "cluster3",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-back-nyc", opacity: 1 },
        { layer: "tracts-back-upstate", opacity: 1 },
      ],
    },
  ],
};

// Config2 for Map2 (mapbox)
const config2 = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  location: {
    center: [-76.490336, 42.752651],
    zoom: 6.3,
    pitch: 0,
    bearing: 0,
  },
  sections: [
    {
      id: "start",
      layers: [
        { layer: "counties-others", opacity: 1 },
        { layer: "counties-upstate", opacity: 1 },
      ],
      default: { attribute: "unserved population / km2", color: color.yellow },
    },
    {
      id: "explore",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 0.8 },
        { layer: "tracts-features-nyc", opacity: 1 },
        { layer: "tracts-features-upstate", opacity: 1 },
      ],
      default: {
        attribute: "physical health not good for >=14 days",
        color: color.blue,
      },
    },
    {
      id: "cluster1",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-features-nyc", opacity: 1 },
        { layer: "tracts-features-upstate", opacity: 1 },
      ],
      default: {
        attribute: "physical health not good for >=14 days",
        color: color.yellow,
      },
    },
    {
      id: "cluster2",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-features-nyc", opacity: 1 },
        { layer: "tracts-features-upstate", opacity: 1 },
      ],
      default: {
        attribute: "unserved medicaid enrollees / km2",
        color: color.yellow,
      },
    },
    {
      id: "cluster3",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "tracts-features-nyc", opacity: 1 },
        { layer: "tracts-features-upstate", opacity: 1 },
      ],
      default: {
        attribute: "commercial district percent",
        color: color.yellow,
      },
    },
  ],
};

// Bounds are used for updating Mapbox layer style
const layerBoundsCountiesNYC = [
  {
    name: "unserved population / km2",
    min: 471.42,
    max: 2220.16,
    rateOfChange: ["linear"],
  },
  {
    name: "unserved medicaid enrollees / km2",
    min: 64.42,
    max: 1785.49,
    rateOfChange: ["linear"],
  },
  {
    name: "unserved commercial enrollees / km2",
    min: 0.0,
    max: 461.61,
    rateOfChange: ["linear"],
  },
];

const layerBoundsCountiesUpstate = [
  {
    name: "unserved population / km2",
    min: 0.0,
    max: 155.13,
    rateOfChange: ["linear"],
  },
  {
    name: "unserved medicaid enrollees / km2",
    min: 0.0,
    max: 71.41,
    rateOfChange: ["linear"],
  },
  {
    name: "unserved commercial enrollees / km2",
    min: 0.0,
    max: 83.72,
    rateOfChange: ["linear"],
  },
];

const layerBoundsTractsNYC = [
  {
    name: "medicaid enrollees / km2",
    min: 48.19,
    max: 55472.48,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "commercial enrollees / km2",
    min: 214.31,
    max: 42294.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "insured population / km2",
    min: 316.5,
    max: 76410.9,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved population / km2",
    min: 12.7,
    max: 45610.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved medicaid enrollees / km2",
    min: 0.0,
    max: 45610.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved commercial enrollees / km2",
    min: 0.0,
    max: 12665.9,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "average land price / ft2",
    min: 2.67,
    max: 34.29,
    rateOfChange: ["linear"],
  },
  {
    name: "agricultural land percent",
    min: 0.0,
    max: 0.1,
    rateOfChange: ["linear"],
  },
  {
    name: "residential district percent",
    min: 0.08,
    max: 1.0,
    rateOfChange: ["linear"],
  },
  {
    name: "vacant land percent",
    min: 0.0,
    max: 0.53,
    rateOfChange: ["linear"],
  },
  {
    name: "commercial district percent",
    min: 0.0,
    max: 0.48,
    rateOfChange: ["linear"],
  },
  {
    name: "industrial district percent",
    min: 0.0,
    max: 0.08,
    rateOfChange: ["linear"],
  },
  {
    name: "drove alone percent",
    min: 0.01,
    max: 0.72,
    rateOfChange: ["linear"],
  },
  { name: "carpooled percent", min: 0.0, max: 0.28, rateOfChange: ["linear"] },
  {
    name: "public transit percent",
    min: 0.09,
    max: 0.94,
    rateOfChange: ["linear"],
  },
  { name: "walked percent", min: 0.0, max: 0.58, rateOfChange: ["linear"] },
  {
    name: "worked from home percent",
    min: 0.0,
    max: 0.34,
    rateOfChange: ["linear"],
  },
  {
    name: "no leisure-time physical activity",
    min: 17.5,
    max: 51.2,
    rateOfChange: ["linear"],
  },
  { name: "binge drinking", min: 8.8, max: 22.2, rateOfChange: ["linear"] },
  {
    name: "sleeping less than 7 hours",
    min: 28.4,
    max: 46.8,
    rateOfChange: ["linear"],
  },
  { name: "current smoking", min: 7.9, max: 30.1, rateOfChange: ["linear"] },
  {
    name: "cholesterol screening",
    min: 70.6,
    max: 92.9,
    rateOfChange: ["linear"],
  },
  {
    name: "current lack of health insurance",
    min: 4.1,
    max: 30.4,
    rateOfChange: ["linear"],
  },
  {
    name: "taking medicine for high blood pressure",
    min: 57.2,
    max: 86.8,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to dentist or dental clinic",
    min: 34.6,
    max: 77.2,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to doctor for routine checkup",
    min: 67.4,
    max: 85.6,
    rateOfChange: ["linear"],
  },
  {
    name: "physical health not good for >=14 days",
    min: 7.0,
    max: 21.7,
    rateOfChange: ["linear"],
  },
  {
    name: "mental health not good for >=14 days",
    min: 10.4,
    max: 27.7,
    rateOfChange: ["linear"],
  },
  {
    name: "fair or poor self-rated health status",
    min: 9.4,
    max: 39.1,
    rateOfChange: ["linear"],
  },
  {
    name: "median household income",
    min: 17083.0,
    max: 191083.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median household disposable income",
    min: 3107.0,
    max: 150067.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median monthly housing cost",
    min: 388.0,
    max: 3418.0,
    rateOfChange: ["linear"],
  },
];

const layerBoundsTractsUpstate = [
  {
    name: "medicaid enrollees / km2",
    min: 1.09,
    max: 6413.96,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "commercial enrollees / km2",
    min: 6.12,
    max: 6286.56,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "insured population / km2",
    min: 10.0,
    max: 7932.0,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "unserved population / km2",
    min: 0.2,
    max: 6514.3,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "unserved medicaid enrollees / km2",
    min: 0.0,
    max: 5970.6,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "unserved commercial enrollees / km2",
    min: 0.0,
    max: 2495.3,
    rateOfChange: ["exponential", 0.995],
  },
  {
    name: "average land price / ft2",
    min: 0.0,
    max: 21.45,
    rateOfChange: ["linear"],
  },
  {
    name: "agricultural land percent",
    min: 0.0,
    max: 0.18,
    rateOfChange: ["linear"],
  },
  {
    name: "residential district percent",
    min: 0.0,
    max: 0.98,
    rateOfChange: ["linear"],
  },
  {
    name: "vacant land percent",
    min: 0.0,
    max: 0.46,
    rateOfChange: ["linear"],
  },
  {
    name: "commercial district percent",
    min: 0.0,
    max: 0.57,
    rateOfChange: ["linear"],
  },
  {
    name: "industrial district percent",
    min: 0.0,
    max: 0.03,
    rateOfChange: ["linear"],
  },
  {
    name: "drove alone percent",
    min: 0.24,
    max: 0.98,
    rateOfChange: ["linear"],
  },
  { name: "carpooled percent", min: 0.0, max: 0.3, rateOfChange: ["linear"] },
  {
    name: "public transit percent",
    min: 0.0,
    max: 0.39,
    rateOfChange: ["linear"],
  },
  {
    name: "walked percent",
    min: 0.0,
    max: 0.58,
    rateOfChange: ["linear"],
  },
  {
    name: "worked from home percent",
    min: 0.0,
    max: 0.34,
    rateOfChange: ["linear"],
  },
  {
    name: "no leisure-time physical activity",
    min: 13.4,
    max: 47.6,
    rateOfChange: ["linear"],
  },
  { name: "binge drinking", min: 10.9, max: 24.6, rateOfChange: ["linear"] },
  {
    name: "sleeping less than 7 hours",
    min: 25.7,
    max: 46.2,
    rateOfChange: ["linear"],
  },
  { name: "current smoking", min: 7.4, max: 40.4, rateOfChange: ["linear"] },
  {
    name: "cholesterol screening",
    min: 63.7,
    max: 92.9,
    rateOfChange: ["linear"],
  },
  {
    name: "current lack of health insurance",
    min: 2.7,
    max: 24.1,
    rateOfChange: ["linear"],
  },
  {
    name: "taking medicine for high blood pressure",
    min: 56.9,
    max: 83.2,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to dentist or dental clinic",
    min: 37.0,
    max: 81.5,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to doctor for routine checkup",
    min: 69.3,
    max: 87.2,
    rateOfChange: ["linear"],
  },
  {
    name: "physical health not good for >=14 days",
    min: 6.9,
    max: 20.3,
    rateOfChange: ["linear"],
  },
  {
    name: "mental health not good for >=14 days",
    min: 9.9,
    max: 29.1,
    rateOfChange: ["linear"],
  },
  {
    name: "fair or poor self-rated health status",
    min: 7.6,
    max: 34.6,
    rateOfChange: ["linear"],
  },
  {
    name: "median household income",
    min: 19948.0,
    max: 239028.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median household disposable income",
    min: 7086.0,
    max: 205404.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median monthly housing cost",
    min: 461.0,
    max: 3923.0,
    rateOfChange: ["linear"],
  },
];

// Unit categories are used to adjust scales in legend
const unitPopulationDensity = [
  "medicaid enrollees / km2",
  "commercial enrollees / km2",
  "insured population / km2",
  "unserved medicaid enrollees / km2",
  "unserved commercial enrollees / km2",
  "unserved population / km2",
];
const unitHealthSurvey = [
  "no leisure-time physical activity",
  "binge drinking",
  "sleeping less than 7 hours",
  "current smoking",
  "cholesterol screening",
  "current lack of health insurance",
  "taking medicine for high blood pressure",
  "visits to dentist or dental clinic",
  "visits to doctor for routine checkup",
  "physical health not good for >=14 days",
  "mental health not good for >=14 days",
  "fair or poor self-rated health status",
];
const unitDollar = [
  "average land price / ft2",
  "median household income",
  "median household disposable income",
  "median monthly housing cost",
];
const unitLandUse = [
  "agricultural land percent",
  "residential district percent",
  "commercial district percent",
  "industrial district percent",
  "vacant land percent",
];
const unitTransportation = [
  "drove alone percent",
  "carpooled percent",
  "public transit percent",
  "walked percent",
  "worked from home percent",
];
