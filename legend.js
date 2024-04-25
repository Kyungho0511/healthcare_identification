function updateLegend(title, scaleMin, scaleMax, bound) {
  title.innerText = bound.name;

  // adjust scale units based on layer name
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

  if (unitPopulationDensity.includes(bound.name)) {
    scaleMin.innerText = 0;
    scaleMax.innerText = `${Math.round(bound.max / 1000)} k`;
  } else if (unitHealthSurvey.includes(bound.name)) {
    scaleMin.innerText = `${Math.round(bound.min)} %`;
    scaleMax.innerText = `${Math.round(bound.max)} %`;
  } else if (unitDollar.includes(bound.name)) {
    scaleMin.innerText = `$ ${Math.round(bound.min).toLocaleString("en-US")}`;
    scaleMax.innerText = `$ ${Math.round(bound.max).toLocaleString("en-US")}`;
  } else if (
    unitLandUse.includes(bound.name) ||
    unitTransportation.includes(bound.name)
  ) {
    scaleMin.innerText = `${Math.round(bound.min * 100)} %`;
    scaleMax.innerText = `${Math.round(bound.max * 100)} %`;
  }
}

function updateClusterLegend(legend) {
  const list = legend.querySelector(".cluster-legend-list");

  // Vulnerability cluster
  if (legend.classList.contains("cluster-legend-map")) {
    // update cluster list items here!
  }

  // Profitability cluster
  if (legend.classList.contains("cluster-legend-map2")) {
    // update cluster list items here!
  }
}

// Retrieve categorized colors from config and update cluster color-boxes with them
const colorBoxesMap = clusterLegendMap.querySelectorAll(".color-box");
const colorBoxesMap2 = clusterLegendMap2.querySelectorAll(".color-box");

colorBoxesMap.forEach((box, idx) => {
  box.style.backgroundColor = color.yellow.categorized[idx];
});
colorBoxesMap2.forEach((box, idx) => {
  box.style.backgroundColor = color.blue.categorized[idx];
});
