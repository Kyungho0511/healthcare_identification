const explore = document.querySelector("#explore");
const exploreDatasetContainers = explore.querySelectorAll(".sidebar__dataset");
const exploreContinueBtn = explore.querySelector(".footerbar__button");

// Explore selected dataset icon interaction:
explore.querySelectorAll(".fa-square-plus").forEach((icon) => {
  icon.addEventListener("click", function () {
    const originalListItem = icon.closest(".dataset__item");
    const targetList = document.querySelector(".selected_dataset");

    if (!icon.classList.contains("added")) {
      // Append a clone of the 'li' to each target 'ul'
      const clonedListItem = originalListItem.cloneNode(true);
      const clonedIcon = clonedListItem.querySelector(".fa-square-plus");

      // Add cloned item to the selected dataset
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

// Mouse interaction with dataset item
exploreDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  // Target Data:
  if (container.classList.contains("target_data")) {
    setDataMappingInteraction(
      explore,
      container,
      color.yellow.min,
      color.yellow.max,
      "map"
    );

    // Second Data:
  } else if (container.classList.contains("second_data")) {
    setDataMappingInteraction(
      explore,
      container,
      color.blue.min,
      color.blue.max,
      "map2"
    );
  }
});

function setDataMappingInteraction(
  section,
  container,
  colorMin,
  colorMax,
  mapId
) {
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
            colorMin,
            colorMax,
            bound.rateOfChange,
            mapId
          );

          const legend = section.querySelector(`.legend-${mapId}`);
          updateLegend(
            legend.querySelector(".legend__title"),
            legend.querySelector(".scale-min"),
            legend.querySelector(".scale-max"),
            bound
          );
        }
      });
    }
  });
}

exploreContinueBtn.addEventListener("click", () => {
  // Store selectedDatasetItems to session storage (declared in config.js)
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

  // Copy and paste selectedDatasetItems to Cluster1,2,3 sections
  const list = document.createElement("ul");
  selectedDatasetItems.forEach((item) => createItem(list, item, "plus"));

  for (let i = 0; i < 3; i++) {
    // Add selected dataset items
    const cluster = document.querySelector(`#cluster${i + 1}`);
    const dataset = cluster.querySelector(".selected_dataset");
    dataset.innerHTML = list.innerHTML;

    // "features to add" icon interaction for Cluster1,2,3 sections
    setClusterAddedFeatureInteraction(cluster);
  }
});

function setAddedFeatures() {
  // All Sections: add selected dataset items
  const listExplore = document.createElement("ul");
  const listCluster = document.createElement("ul");
  selectedDatasetItems.forEach((item) =>
    createItem(listExplore, item, "minus")
  );
  selectedDatasetItems.forEach((item) => createItem(listCluster, item, "plus"));
  document.querySelectorAll(".selected_dataset").forEach((dataset) => {
    if (dataset.classList.contains("explore")) {
      dataset.innerHTML = listExplore.innerHTML;
    } else {
      dataset.innerHTML = listCluster.innerHTML;
    }
  });

  // Cluster: restore Plus icon interaction
  for (let i = 0; i < 3; i++) {
    const cluster = document.querySelector(`#cluster${i + 1}`);

    // "features to add" icon interaction for Cluster1,2,3 sections
    setClusterAddedFeatureInteraction(cluster);
  }
  // Explore: add added sign for selected item in Target data and Second data containers
  explore.querySelectorAll(".selectable").forEach((container) => {
    container.querySelectorAll(".dataset__item").forEach((item) => {
      if (selectedDatasetItems.includes(item.querySelector("p").innerText)) {
        item.querySelector("i").classList.add("added");
      }
    });
  });

  // Explore: restore Minus icon interaction for selected dataset from Session Storage on reload:
  explore.querySelectorAll(".fa-square-minus").forEach((icon) => {
    icon.addEventListener("click", () => {
      // Remove data from the selected dataset container on click
      icon.parentElement.remove();

      // Remove added sign from Target data and Second data containers
      const itemToRemove = icon.parentElement.querySelector("p").innerText;
      explore.querySelectorAll(".selectable").forEach((container) => {
        container.querySelectorAll(".dataset__item").forEach((item) => {
          if (
            item.querySelector("p").innerText ===
            icon.parentElement.querySelector("p").innerText
          ) {
            item.querySelector("i").classList.remove("added");
          }
        });
      });
    });
  });
}

function setClusterAddedFeatureInteraction(cluster) {
  cluster.querySelectorAll(".fa-square-plus").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetList = cluster.querySelector(".dataset__list");
      const originalListItem = icon.closest(".dataset__item");

      if (!icon.classList.contains("added")) {
        // Add cloned item to the cluster dataset list
        const clonedListItem = originalListItem.cloneNode(true);
        const clonedIcon = clonedListItem.querySelector(".fa-square-plus");
        if (clonedIcon) {
          clonedIcon.classList.remove("fa-square-plus");
          clonedIcon.classList.add("fa-square-minus");

          // Remove data from the cluster dataset container when minus icon is clicked
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
}
