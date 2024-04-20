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
    5,
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
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  const dropdownButtons = dropdown.querySelectorAll(".dropbtn");
  const dropdownContents = dropdown.querySelectorAll(".dropdown-content");
  const triangles = dropdown.querySelectorAll(".triangle");

  dropdownButtons.forEach((btn, idx) => {
    dropdownButtons[idx].addEventListener("click", () => {
      dropdownContents[idx].style.display =
        dropdownContents[idx].style.display === "block" ? "none" : "block";
      triangles[idx].style.transform =
        dropdownContents[idx].style.display == "block"
          ? "rotate(90deg) translateY(-10%)"
          : "rotate(0deg) translateY(-10%)";
    });
  });
});

map.on("load", () => {
  const expandedLists = document.querySelectorAll(".expanded.dataset__list");
  const expandedTriangles = document.querySelectorAll(".expanded.triangle");

  // expand selected_dataset menu on load
  expandedLists.forEach((list) => (list.style.display = "block"));
  expandedTriangles.forEach(
    (triangle) => (triangle.style.transform = "rotate(90deg) translateY(-10%)")
  );
});

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
    const p = document.createElement("p");
    li.classList.add("dataset__item");
    p.innerText = feature.properties.NAME;
    li.appendChild(p);
    startDatasetList.appendChild(li);
  });
});

// Mouse interaction with dataset item
startDatasetList.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    // Deselect all data
    Array.from(startDatasetList.children).forEach((item) => {
      item.querySelector("p").classList.remove("selectedData");
    });

    // Highlight selected data
    event.target.classList.add("selectedData");
    start.querySelector(".footerbar__button").disabled = false;

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
  // Check the opacity of the layer and If opacity is 0, return and do nothing
  const layerOpacity = map.getPaintProperty("32counties", "fill-opacity");
  if (layerOpacity === 0) return;

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
  start.querySelector(".footerbar__button").disabled = false;

  // highlight associated dataset item
  Array.from(startDatasetList.children).forEach((item) => {
    if (item.innerText === feature[0].properties.NAME) {
      item.querySelector("p").classList.add("selectedData");
    } else {
      item.querySelector("p").classList.remove("selectedData");
    }
  });
});

/**
 * Explore section
 */
const explore = document.querySelector("#explore");
const exploreDatasetContainers = explore.querySelectorAll(".sidebar__dataset");

// fill dataset container with layers on the mapbox studio
map.on("load", () => {});
// Mouse interaction with dataset item
exploreDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  container.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      // Deselect all data
      container.querySelectorAll("p").forEach((item) => {
        item.classList.remove("selectedData");
      });

      // Highlight selected data
      event.target.classList.add("selectedData");
      // start.querySelector(".footerbar__button").disabled = false;
    }
  });
});

// Add data to the selected dataset container when plus icon is clicked
explore.querySelectorAll(".fa-square-plus").forEach((icon) => {
  icon.addEventListener("click", function () {
    const originalListItem = icon.closest(".dataset__item");

    // Clone the 'li' element
    const clonedListItem = originalListItem.cloneNode(true); // 'true' means deep clone including children

    // Change the icon class in the cloned item from 'fa-square-plus' to 'fa-square-minus'
    const clonedIcon = clonedListItem.querySelector(".fa-square-plus");
    if (clonedIcon) {
      clonedIcon.classList.remove("fa-square-plus");
      clonedIcon.classList.add("fa-square-minus");

      // Remove data from the selected dataset container when minus icon is clicked
      clonedIcon.addEventListener("click", () => {
        clonedListItem.remove();
        icon.classList.remove("added");
      });
    }

    // Find the target 'ul' element where the cloned 'li' should be appended
    const targetList = document.querySelector(
      ".dataset__list.selected_dataset"
    );

    // Append the cloned 'li' to the target 'ul' if targetList doesn't have the same item
    if (!icon.classList.contains("added")) {
      targetList.appendChild(clonedListItem);
      icon.classList.add("added");
    }
  });
});
