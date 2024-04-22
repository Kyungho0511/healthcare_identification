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
        sourceLayer: "shortage_counties-4sc41a",
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

function updateLayerStyle(
  layer,
  attribute,
  min,
  max,
  colorMin,
  colorMax,
  rateOfChange
) {
  map.setPaintProperty(layer, "fill-color", [
    "interpolate",
    rateOfChange,
    ["get", attribute],
    min,
    colorMin,
    max,
    colorMax,
  ]);
}

function updateLayerStyleMap2(
  layer,
  attribute,
  min,
  max,
  colorMin,
  colorMax,
  rateOfChange
) {
  map2.setPaintProperty(layer, "fill-color", [
    "interpolate",
    rateOfChange,
    ["get", attribute],
    min,
    colorMin,
    max,
    colorMax,
  ]);
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
const startDatasetContainers = start.querySelectorAll(".dataset__list");
const countiesContainer = start.querySelector(".counties");
const upstateCountiesContainer = start.querySelector(".upstate_counties");
const nycCountiesContainer = start.querySelector(".nyc_counties");

// Min, max for layers in start section
const startLayerBounds = [
  { name: "unserved medicaid enrollees / km2", min: 0, max: 1785 },
  { name: "unserved commercial enrollees / km2", min: 0, max: 460 },
  { name: "unserved population / km2", min: 0, max: 2220 },
];

// Temporary code for adding county groups at once
const selectCountiesBtn = start.querySelectorAll(".select-counties");
selectCountiesBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("added")) {
      btn.classList.remove("added");
    } else {
      btn.classList.add("added");
    }

    // Activate continue button when user selected counties
    start.querySelector(".footerbar__button").disabled = true;
    selectCountiesBtn.forEach((btn) => {
      if (btn.classList.contains("added")) {
        start.querySelector(".footerbar__button").disabled = false;
      }
    });
  });
});

// Mouse interaction with dataset item
startDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  container.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      // Deselect all data
      container.querySelectorAll("p").forEach((item) => {
        item.classList.remove("selectedData");
      });

      // Highlight selected data
      event.target.classList.add("selectedData");

      if (
        event.target.parentElement.parentElement.classList.contains(
          "new_york_state_counties"
        )
      ) {
        start.querySelector(".footerbar__button").disabled = false;
      }

      if (
        event.target.parentElement.parentElement.classList.contains(
          "unserved_population_density"
        )
      ) {
        startLayerBounds.forEach((bound) => {
          if (bound.name === event.target.innerText.toLowerCase()) {
            updateLayerStyle(
              "32counties",
              bound.name,
              bound.min,
              bound.max,
              color.blue.min,
              color.blue.max,
              ["exponential", 0.995]
            );

            updateLegend(
              start.querySelector(".legend__title"),
              start.querySelector(".scale-min"),
              start.querySelector(".scale-max"),
              bound
            );
          }
        });
      }

      // // Highlight associated Mapbox layer
      // thickenOutline(event.target.innerText);
      // selectedFeature = selectFeatureByName(
      //   "32counties",
      //   "NAME",
      //   event.target.innerText
      // );
    }
  });
});

// // Mouse interaction with Mapbox layer
// map.on("click", "32counties", (event) => {
//   // Check the opacity of the layer and If opacity is 0, return and do nothing
//   const layerOpacity = map.getPaintProperty("32counties", "fill-opacity");
//   if (layerOpacity === 0) return;

//   const feature = map.queryRenderedFeatures(event.point, {
//     layers: ["32counties"],
//   });
//   thickenOutline(feature[0].properties.NAME);
//   selectedFeature = selectFeatureByName(
//     "32counties",
//     "NAME",
//     feature[0].properties.NAME
//   );
//   start.querySelector(".footerbar__button").disabled = false;

//   // highlight associated dataset item
//   countiesContainer.querySelectorAll("li").forEach((item) => {
//     if (item.innerText === feature[0].properties.NAME) {
//       item.querySelector("p").classList.add("selectedData");
//     } else {
//       item.querySelector("p").classList.remove("selectedData");
//     }
//   });
// });
