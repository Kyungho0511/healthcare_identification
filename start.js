/**
 * Start section
 */
const start = document.querySelector("#start");
const startDatasetContainers = start.querySelectorAll(".dataset__list");
const countiesContainer = start.querySelector(".counties");
const upstateCountiesContainer = start.querySelector(".upstate_counties");
const nycCountiesContainer = start.querySelector(".nyc_counties");

// Temporary: adding a group of counties at once
const selectCountiesBtn = start.querySelectorAll(".select-counties");
selectCountiesBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Store selected counties for flyTo function
    selectedCounties = btn.innerText;

    // Activate continue button when user selected counties
    start.querySelector(".footerbar__button").disabled = true;
    selectCountiesBtn.forEach((btn) => {
      if (btn.classList.contains("added")) {
        start.querySelector(".footerbar__button").disabled = false;
      }
    });
  });
});

// // Mouse interaction with dataset item
// startDatasetContainers.forEach((container) => {
//   if (!container.classList.contains("selectable")) return;

//   container.addEventListener("click", (event) => {
//     if (event.target.tagName === "P") {
//       // Deselect all data
//       container.querySelectorAll("p").forEach((item) => {
//         item.classList.remove("selectedData");
//       });

//       // Highlight selected data
//       event.target.classList.add("selectedData");

//       if (
//         event.target.parentElement.parentElement.classList.contains(
//           "new_york_state_counties"
//         )
//       ) {
//         start.querySelector(".footerbar__button").disabled = false;
//       }

//       // Highlight associated Mapbox layer
//       thickenOutline(event.target.innerText);
//       selectedFeature = selectFeatureByName(
//         "32counties",
//         "NAME",
//         event.target.innerText
//       );
//     }
//   });
// });

// // Mouse interaction with Map1 Mapbox layer
// map.on("click", "32counties", (event) => {
//   // Check the opacity of the layer and If opacity is 0, return and do nothing
//   const layerOpacity = map.getPaintProperty("32counties", "fill-opacity");
//   if (layerOpacity === 0) return;

//   // Select NYC counties on click
//   const feature = map.queryRenderedFeatures(event.point, {
//     layers: ["32counties"],
//   });
//   thickenOutline(feature[0].properties.NAME);
//   selectedFeature = selectFeatureByName(
//     "32counties",
//     "NAME",
//     feature[0].properties.NAME
//   );
// });

// // Mouse interaction with Map2 Mapbox layer
// map2.on("click", "32counties", (event) => {
//   // Check the opacity of the layer and If opacity is 0, return and do nothing
//   const layerOpacity = map2.getPaintProperty("32counties", "fill-opacity");
//   if (layerOpacity === 0) return;

//   // Select Update NY counties on click
//   const feature = map2.queryRenderedFeatures(event.point, {
//     layers: ["32counties"],
//   });
//   thickenOutlineMap2(feature[0].properties.NAME);
//   selectedFeature = selectFeatureByName(
//     "32counties",
//     "NAME",
//     feature[0].properties.NAME
//   );
// });

// Color dataset items with theme color
upstateCountiesContainer.querySelectorAll("p").forEach((p) => {
  p.style.color = color.yellow.max;
});
nycCountiesContainer.querySelectorAll("p").forEach((p) => {
  p.style.color = color.yellow.max;
});
