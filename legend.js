function onLegend(sectionId, mapId) {
  const section =
    mapId === "map"
      ? config.sections.find((sec) => sec.id === sectionId)
      : config2.sections.find((sec) => sec.id === sectionId);

  const legend = document
    .querySelector(`#${sectionId}`)
    .querySelector(`.legend-${mapId}`);

  // Edge case 1
  if (sectionId === "start") {
    updateLegend(
      legend.querySelector(".legend__title"),
      legend.querySelector(".scale-min"),
      legend.querySelector(".scale-max"),
      mapId === "map"
        ? layerBoundsCountiesNYC[0]
        : layerBoundsCountiesUpstate[0]
    );
  }

  // Edge Case 2
  else if (sectionId === "cluster") {
    updateClusterLegend(legend);
  }

  // Normal case:
  else {
    updateLegend(
      legend.querySelector(".legend__title"),
      legend.querySelector(".scale-min"),
      legend.querySelector(".scale-max"),
      selectedCounties === "NYC Counties"
        ? layerBoundsTractsNYC.find(
            (bound) => bound.name === section.default.attribute
          )
        : layerBoundsTractsUpstate.find(
            (bound) => bound.name === section.default.attribute
          )
    );
  }
}

function updateLegend(title, scaleMin, scaleMax, bound) {
  title.innerText = bound.name;

  if (unitPopulationDensity.includes(bound.name)) {
    scaleMin.innerText = 0;
    scaleMax.innerText = `${Math.round(bound.max / 100) / 10} k`;
  } else if (unitHealthSurvey.includes(bound.name)) {
    scaleMin.innerText = `${Math.round(bound.min)} %`;
    scaleMax.innerText = `${Math.round(bound.max)} %`;
  } else if (unitDollar.includes(bound.name)) {
    if (bound.name === "average land price / ft2") {
      scaleMin.innerText = `$ ${Math.round(bound.min * 50).toLocaleString(
        "en-US"
      )}`;
      scaleMax.innerText = `$ ${Math.round(bound.max * 50).toLocaleString(
        "en-US"
      )}`;
    } else {
      scaleMin.innerText = `$ ${Math.round(bound.min).toLocaleString("en-US")}`;
      scaleMax.innerText = `$ ${Math.round(bound.max).toLocaleString("en-US")}`;
    }
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
