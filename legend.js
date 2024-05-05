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

  // Normal case:
  else if (sectionId === "explore") {
    updateLegend(
      legend.querySelector(".legend__title"),
      legend.querySelector(".scale-min"),
      legend.querySelector(".scale-max"),
      findBound(section.default.attribute)
    );
  }
}

function updateLegend(title, scaleMin, scaleMax, bound) {
  title.innerText = bound.name;
  scaleMin.innerText = formatUnit(bound.min, bound.name);
  scaleMax.innerText = formatUnit(bound.max, bound.name);
}

function updateClusterLegend(legend, title, centroids, features, color) {
  // Set title
  legend.querySelector(".legend__title").innerText = `${title} clusters`;

  // Set legend item name and color-box
  const items = legend.querySelectorAll(".dropbtn");
  items.forEach((item, i) => {
    item.innerHTML = `<span class="color-box"></span>cluster${i + 1}`;
    item.querySelector(".color-box").style.backgroundColor = color[i];
  });

  // Set dropdown sub-items
  const subLists = legend.querySelectorAll(".cluster-legend-list");
  subLists.forEach((list, i) => {
    list.innerHTML = "";
    centroids[i].centroid.forEach((num, j) => {
      // Unnormalize and format numbers
      const bound = findBound(features[j]);
      const unNormalizedNum = unNormalize(num, bound.min, bound.max);
      const formattedNum = formatUnit(
        unNormalizedNum,
        clusterFeatures[`${title}`][j]
      );

      // Append list items
      const li = document.createElement("li");
      li.innerHTML = `${clusterFeatures[`${title}`][j]}: ${formattedNum}`;
      list.appendChild(li);
    });
  });
}

function findBound(attribute) {
  const bound =
    selectedCounties === "NYC Counties"
      ? layerBoundsTractsNYC.find((bound) => bound.name === attribute)
      : layerBoundsTractsUpstate.find((bound) => bound.name === attribute);

  return bound;
}

function unNormalize(val, originalMin, originalMax) {
  // restore original value of the normalized(0-1)
  return (originalMax - originalMin) * val;
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
