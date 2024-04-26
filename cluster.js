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

// Handle cluster button to update cluster legend
const clusterLegendMap = cluster.querySelector(".legend-map");
const clusterLegendMap2 = cluster.querySelector(".legend-map2");

cluster
  .querySelector(".cluster-map")
  .addEventListener("click", () => updateClusterLegend(clusterLegendMap));

cluster
  .querySelector(".cluster-map2")
  .addEventListener("click", () => updateClusterLegend(clusterLegendMap2));

// cluster legend is moved to Select section when continue button is clicked
cluster.querySelector(".footerbar__button").addEventListener("click", () => {
  const clonedlegendMap = clusterLegendMap.cloneNode(true);
  const clonedlegendMap2 = clusterLegendMap2.cloneNode(true);

  const select = document.querySelector("#select");
  select.appendChild(clonedlegendMap);
  select.appendChild(clonedlegendMap2);
});
