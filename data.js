// Hover effect (mapbox studio duplicates feature ids by mistake, when uploading geojson)
// solution: set id states with a unique feature property for every geometry within feature
// then in setPaintProperty, do self-reference. so features with the same id are uniquely identifiable.
map.on("load", () => {
  setHoverPaintProperty("32counties-outline", "NAME");
});

function setHoverPaintProperty(layer, property) {
  map.setPaintProperty(layer, "line-width", [
    "case",
    ["==", ["get", property], ["feature-state", "id"]],
    4,
    0,
  ]);
}

function thickenOutline(name) {
  for (let i = 0; i < 40; i++) {
    map.setFeatureState(
      {
        source: "composite",
        sourceLayer: "shortage_counties-2zvmkt",
        id: i,
      },
      { id: name }
    );
  }
}

let selectedFeature = null;

function zoomToFeature() {
  // Handle MultiPolygon by finding the largest polygon based on area
  if (selectedFeature.geometry.type === "MultiPolygon") {
    const largestPolygon = findLargestPolygon(
      selectedFeature.geometry.coordinates
    );
    const bounds = coordinatesToBoundsMultipolygon(largestPolygon);
    map.fitBounds(bounds, { padding: 20 });
  } else {
    const bounds = coordinatesToBoundsPolygon(
      selectedFeature.geometry.coordinates
    );
    map.fitBounds(bounds, { padding: 20 });
  }
}

function findLargestPolygon(multiPolygonCoords) {
  let maxArea = 0;
  let largestPolygon = [];

  multiPolygonCoords.forEach((polygonCoords) => {
    const area = calculatePolygonArea(polygonCoords[0]); // Only consider the outer ring
    if (area > maxArea) {
      maxArea = area;
      largestPolygon = polygonCoords[0];
    }
  });

  return largestPolygon;
}

function calculatePolygonArea(coords) {
  let area = 0;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const point1 = coords[i];
    const point2 = coords[j];
    area += point1[0] * point2[1];
    area -= point1[1] * point2[0];
  }
  return Math.abs(area / 2);
}

function coordinatesToBoundsMultipolygon(coords) {
  const bounds = new mapboxgl.LngLatBounds();
  coords.forEach((coord) => {
    bounds.extend(coord);
  });
  return bounds;
}

function coordinatesToBoundsPolygon(coords) {
  const bounds = new mapboxgl.LngLatBounds();
  coords.forEach((coord) => {
    if (Array.isArray(coord[0])) {
      // This handles nested coordinates for polygons
      coord.forEach((c) => {
        bounds.extend(c);
      });
    } else {
      bounds.extend(coord);
    }
  });

  return bounds;
}

function selectFeatureByName(layerId, propertyName, value) {
  const features = map.queryRenderedFeatures({
    layers: [layerId],
  });
  const selectedFeature = features.find(
    (feature) => feature.properties[propertyName] === value
  );

  return selectedFeature;
}

/**
 * Dropdown dataset menu interaction
 */
const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const triangle = document.querySelector(".triangle");

dropdownButton.onclick = function () {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
  triangle.style.transform =
    dropdownContent.style.display === "block"
      ? "rotate(90deg) translateY(-10%)"
      : "rotate(0deg) translateY(-10%)";
};

/**
 * Start section
 */
const start = document.querySelector("#start");
const startDatasetList = start.querySelector(".dataset__list");

// fill dataset container with layers on the mapbox studio
map.on("load", () => {
  const layer = map.getLayer("32counties");
  const features = map.queryRenderedFeatures({ layers: [layer.id] });
  features.forEach((feature) => {
    const li = document.createElement("li");
    li.classList.add("dataset__item");
    li.innerText = feature.properties.NAME;
    startDatasetList.appendChild(li);

    // expand dataset menu on load
    startDatasetList.style.display = "block";
    start.querySelector(".triangle").style.transform =
      "rotate(90deg) translateY(-10%)";
  });
});

// Mouse interaction with dataset item
startDatasetList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    // Deselect all data
    Array.from(startDatasetList.children).forEach((data) => {
      data.classList.remove("selectedData");
    });

    // Highlight selected data
    event.target.classList.add("selectedData");

    // Highlight associated Mapbox layer
    thickenOutline(event.target.innerText);
    selectedFeature = selectFeatureByName(
      "32counties",
      "NAME",
      event.target.innerText
    );
  }
});

// Mouse interaction with Mapbox layer
map.on("click", "32counties", (event) => {
  const feature = map.queryRenderedFeatures(event.point, {
    layers: ["32counties"],
  });
  console.log(feature[0].geometry);
  thickenOutline(feature[0].properties.NAME);
  selectedFeature = selectFeatureByName(
    "32counties",
    "NAME",
    feature[0].properties.NAME
  );

  // highlight associated dataset item
  Array.from(startDatasetList.children).forEach((data) => {
    if (data.innerText === feature[0].properties.NAME) {
      data.classList.add("selectedData");
    } else {
      data.classList.remove("selectedData");
    }
  });
});

/**
 * Explore section
 */
const explore = document.querySelector("#explore");
const exploreDatasetList = start.querySelector(".dataset__list");

// fill dataset container with layers on the mapbox studio
map.on("load", () => {});
