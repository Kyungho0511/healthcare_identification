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
  scaleMin.innerText = formatUnit(bound.min, bound.name);
  scaleMax.innerText = formatUnit(bound.max, bound.name);
}

function updateClusterLegend(legend, title, centroids) {
  // Set title
  legend.querySelector(".legend__title").innerText = `${title} clusters`;

  // Set legend item name and color-box
  const items = legend.querySelectorAll(".dropbtn");
  items.forEach((item, idx) => {
    item.innerHTML = `<span class="color-box"></span>cluster${idx + 1}`;
    item.querySelector(".color-box").style.backgroundColor =
      color.yellow.categorized[idx];
  });

  // Set dropdown sub-items
  const subLists = legend.querySelectorAll(".cluster-legend-list");
  subLists.forEach((list, idx) => {
    list.innerHTML = "";
    centroids[idx].centroid.forEach((num, idx) => {
      // Format scale and unit
      let formattedNum = formatUnit(num, clusterFeatures[`${title}`][idx]);

      // Append list items
      const li = document.createElement("li");
      li.innerHTML = `${clusterFeatures[`${title}`][idx]}: ${formattedNum}`;
      list.appendChild(li);
    });
  });
}

function formatUnit(num, name) {
  if (unitPopulationDensity.includes(name)) {
    return `${Math.round(num / 100) / 10}k`;
  } else if (unitHealthSurvey.includes(name)) {
    return `${Math.round(num)}%`;
  } else if (unitDollar.includes(name)) {
    if (name === "average land price / ft2") {
      return `$ ${Math.round(num * 50).toLocaleString("en-US")}`;
    } else {
      return `$ ${Math.round(num).toLocaleString("en-US")}`;
    }
  } else if (unitLandUse.includes(name) || unitTransportation.includes(name)) {
    return `${Math.round(num * 100)}%`;
  }
}
