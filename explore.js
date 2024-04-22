/**
 * Explore section
 */
const explore = document.querySelector("#explore");
const exploreDatasetContainers = explore.querySelectorAll(".sidebar__dataset");

// Min, max for layers in start section
const layerBounds = [
  { name: "medicaid enrollees / km2", min: 1, max: 55470 },
  { name: "commercial enrollees / km2", min: 5, max: 42290 },
  { name: "insured population / km2", min: 10, max: 76410 },
  { name: "unserved medicaid enrollees / km2", min: 0, max: 25000 },
  { name: "unserved commercial enrollees / km2", min: 0, max: 25000 },
  { name: "average land price / ft2", min: 0.0, max: 34.29 },
  { name: "agricultural land percent", min: 0.0, max: 0.25 },
  { name: "residential district percent", min: 0.0, max: 1.0 },
  { name: "vacant land percent", min: 0.0, max: 0.53 },
  { name: "commercial district percent", min: 0.0, max: 0.57 },
  { name: "industrial district percent", min: 0.0, max: 0.18 },
  { name: "residential area / ft2", min: 0.0, max: 2.64 },
  { name: "commercial area / ft2", min: 0.0, max: 1.12 },
  { name: "drove alone percent", min: 0.01, max: 0.98 },
  { name: "carpooled percent", min: 0.0, max: 0.3 },
  { name: "public transit percent", min: 0.0, max: 0.94 },
  { name: "walked percent", min: 0.0, max: 0.58 },
  { name: "worked from home percent", min: 0.0, max: 0.34 },
  { name: "no leisure-time physical activity", min: 13.0, max: 53.0 },
  { name: "binge drinking", min: 8.8, max: 28.7 },
  { name: "sleeping less than 7 hours", min: 25.7, max: 47.3 },
  { name: "current smoking", min: 7.4, max: 40.4 },
  { name: "cholesterol screening", min: 59.2, max: 92.9 },
  { name: "current lack of health insurance", min: 2.7, max: 10.4 },
  { name: "taking medicine for high blood pressure", min: 22.2, max: 86.8 },
  { name: "visits to dentist or dental clinic", min: 29.4, max: 81.5 },
  { name: "visits to doctor for routine checkup", min: 63.5, max: 87.2 },
  { name: "physical health not good for >=14 days", min: 4.6, max: 22.0 },
  { name: "mental health not good for >=14 days", min: 9.9, max: 29.3 },
  { name: "fair or poor self-rated health status", min: 5.6, max: 42.1 },
  { name: "median household income", min: 16628.0, max: 239028.0 },
  { name: "median household disposable income", min: 3107.0, max: 205404.0 },
  { name: "median monthly housing cost", min: 388.0, max: 3923.0 },
  { name: "unserved population / km2", min: 0, max: 25000 },
];

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
    }
  });
});

// Add data to the selected dataset container when plus icon is clicked
explore.querySelectorAll(".fa-square-plus").forEach((icon) => {
  icon.addEventListener("click", function () {
    const originalListItem = icon.closest(".dataset__item");
    const targetLists = document.querySelectorAll(
      ".dataset__list.selected_dataset"
    );

    if (!icon.classList.contains("added")) {
      // Append a clone of the 'li' to each target 'ul'
      targetLists.forEach((list, idx) => {
        const clonedListItem = originalListItem.cloneNode(true);
        const clonedIcon = clonedListItem.querySelector(".fa-square-plus");

        // Explore selected dataset
        if (clonedIcon && idx === 0) {
          clonedIcon.classList.remove("fa-square-plus");
          clonedIcon.classList.add("fa-square-minus");

          // Remove data from the selected dataset container when minus icon is clicked
          clonedIcon.addEventListener("click", () => {
            clonedListItem.remove();
            icon.classList.remove("added");
          });
        }

        // Cluster selected dataset
        else {
          // update clonedIcon interaction here!
        }

        list.appendChild(clonedListItem);
      });

      icon.classList.add("added");
    } else {
      // Remove the item from all lists if it has already been added
      icon.classList.remove("added");
      targetLists.forEach((list) => {
        list.querySelectorAll("li").forEach((item) => {
          if (
            item.querySelector("p").innerText ===
            originalListItem.querySelector("p").innerText
          ) {
            item.remove();
          }
        });
      });
    }
  });
});

//  Mouse interaction with dataset item
exploreDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  // Target Data:
  if (container.classList.contains("target_data")) {
    container.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
        layerBounds.forEach((bound) => {
          if (bound.name === event.target.innerText.toLowerCase()) {
            updateLayerStyle(
              "shortage-tracts-with-features",
              bound.name,
              bound.min,
              bound.max,
              color.yellow.min,
              color.yellow.max,
              ["exponential", 0.995]
            );

            const legend1 = explore.querySelector(".legend-map");
            updateLegend(
              legend1.querySelector(".legend__title"),
              legend1.querySelector(".scale-min"),
              legend1.querySelector(".scale-max"),
              bound
            );
          }
        });
      }
    });

    // Second Data:
  } else if (container.classList.contains("second_data")) {
    container.addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
        layerBounds.forEach((bound) => {
          if (bound.name === event.target.innerText.toLowerCase()) {
            updateLayerStyleMap2(
              "shortage-tracts-with-features",
              bound.name,
              bound.min,
              bound.max,
              color.blue.min,
              color.blue.max,
              ["exponential", 0.995]
            );

            const legend2 = explore.querySelector(".legend-map2");
            updateLegend(
              legend2.querySelector(".legend__title"),
              legend2.querySelector(".scale-min"),
              legend2.querySelector(".scale-max"),
              bound
            );
          }
        });
      }
    });
  }
});
