const explore = document.querySelector("#explore");
const exploreDatasetContainers = explore.querySelectorAll(".sidebar__dataset");
const exploreContinueBtn = explore.querySelector(".footerbar__button");

// Add data to the selected dataset container when plus icon is clicked
explore.querySelectorAll(".fa-square-plus").forEach((icon) => {
  icon.addEventListener("click", function () {
    const originalListItem = icon.closest(".dataset__item");
    const targetList = document.querySelector(
      ".dataset__list.selected_dataset"
    );

    if (!icon.classList.contains("added")) {
      // Append a clone of the 'li' to each target 'ul'
      const clonedListItem = originalListItem.cloneNode(true);
      const clonedIcon = clonedListItem.querySelector(".fa-square-plus");

      // Explore selected dataset
      if (clonedIcon) {
        clonedIcon.classList.remove("fa-square-plus");
        clonedIcon.classList.add("fa-square-minus");

        // Remove data from the selected dataset container when minus icon is clicked
        clonedIcon.addEventListener("click", () => {
          clonedListItem.remove();
          icon.classList.remove("added");
        });
      }
      targetList.appendChild(clonedListItem);

      icon.classList.add("added");
    } else {
      // Remove the item from all lists if it has already been added
      icon.classList.remove("added");
      targetList.querySelectorAll("li").forEach((item) => {
        if (
          item.querySelector("p").innerText ===
          originalListItem.querySelector("p").innerText
        ) {
          item.remove();
        }
      });
    }
  });
});

//  Mouse interaction with dataset item (updateLayerStyle & updateLegend)
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

// Store selectedDatasetItems to session storage (declared in config.js)
exploreContinueBtn.addEventListener("click", () => {
  tempDatasets = [];
  explore
    .querySelector(".selected_dataset")
    .querySelectorAll(".dataset__item")
    .forEach((item) => {
      tempDatasets.push(item.querySelector("p").innerText);
    });

  selectedDatasetItems = tempDatasets;
  sessionStorage.setItem(
    "selectedDatasetItems",
    JSON.stringify(selectedDatasetItems)
  );
});

function setSelectedDataset() {
  const list = document.createElement("ul");
  document.querySelectorAll(".selected_dataset").forEach((dataset) => {
    if (dataset.classList.contains("explore")) {
      selectedDatasetItems.forEach((item) => createItem(list, item, "minus"));
      dataset.innerHTML = list.innerHTML;
    } else {
      selectedDatasetItems.forEach((item) => createItem(list, item, "plus"));
      dataset.innerHTML = list.innerHTML;
    }
  });
}
