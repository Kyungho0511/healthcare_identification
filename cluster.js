/**
 * Cluster section
 */
const cluster = document.querySelector("#cluster");
const clusterDatasetContainers = cluster.querySelectorAll(".sidebar__dataset");

// Mouse interaction with dataset item
clusterDatasetContainers.forEach((container) => {
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

//  Mouse interaction with dataset item
clusterDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  // Vulnerability Cluster:
  if (container.classList.contains("vulnerability_cluster")) {
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

            const legend1 = cluster.querySelector(".legend-map");
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

    // Profitability Cluster:
  } else if (container.classList.contains("profitability_cluster")) {
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

            const legend2 = cluster.querySelector(".legend-map2");
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
