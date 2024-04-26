const explore = document.querySelector("#explore");
const exploreDatasetContainers = explore.querySelectorAll(".sidebar__dataset");

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
      const layerBounds =
        selectedCounties === "NYC Counties"
          ? layerBoundsTractsNYC
          : layerBoundsTractsUpstate;
      if (event.target.tagName === "P") {
        layerBounds.forEach((bound) => {
          if (bound.name === event.target.innerText.toLowerCase()) {
            updateLayerStyle(
              selectedCounties === "NYC Counties"
                ? "tracts-features-nyc"
                : "tracts-features-upstate",
              bound.name,
              bound.min,
              bound.max,
              color.yellow.min,
              color.yellow.max,
              bound.rateOfChange,
              "map"
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
      const layerBounds =
        selectedCounties === "NYC Counties"
          ? layerBoundsTractsNYC
          : layerBoundsTractsUpstate;
      if (event.target.tagName === "P") {
        layerBounds.forEach((bound) => {
          if (bound.name === event.target.innerText.toLowerCase()) {
            updateLayerStyle(
              selectedCounties === "NYC Counties"
                ? "tracts-features-nyc"
                : "tracts-features-upstate",
              bound.name,
              bound.min,
              bound.max,
              color.blue.min,
              color.blue.max,
              bound.rateOfChange,
              "map2"
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
