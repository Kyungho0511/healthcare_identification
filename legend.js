function onLegend(sectionId, mapId) {
  const section =
    mapId === "map"
      ? config.sections.find((sec) => sec.id === sectionId)
      : config2.sections.find((sec) => sec.id === sectionId);

  const legend = document
    .querySelector(`#${sectionId}`)
    .querySelector(`.legend-${mapId}`);

  // Edge case 1:
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

  // Edge Case 2:
  else if (
    sectionId === "cluster1" ||
    sectionId === "cluster2" ||
    sectionId === "cluster3"
  ) {
    mapId === "map"
      ? null // ? updateClusterLegend(legend)
      : updateLegend(
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

function updateClusterLegend(legend, title, centroids) {
  // Set title
  legend.querySelector(".legend__title").innerText = title;

  // Set item name and color-box
  const items = legend.querySelectorAll("li");
  items.forEach((item, idx) => {
    item.innerHTML = `<span class="color-box"></span>cluster${idx + 1}`;
    item.querySelector(".color-box").style.backgroundColor =
      color.yellow.categorized[idx];
  });

  console.log(centroids);
}
