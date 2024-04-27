const cluster = document.querySelector("#cluster");
const clusterDatasetContainers = cluster.querySelectorAll(".sidebar__dataset");
const clusterContainer = cluster.querySelector(".cluster-container");
const clusterBtn = cluster.querySelector(".sidebar__button");
const clusterLegendMap = cluster.querySelector(".legend-map");
const clusterLegendMap2 = cluster.querySelector(".legend-map2");

// Mouse interaction with dataset item
clusterDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;
});

// Handle cluster button to update cluster legend
clusterBtn.addEventListener("click", () => {
  // Fetch tracts_features GeoJSON
  if (selectedCounties === "NYC Counties") {
    fetch("data/tracts_features_nyc.geojson")
      .then((response) => response.json())
      .then((data) => {
        const features = getFeatures();
        clusterFeatures(data, features);
      })
      .catch((error) =>
        console.error("Error fetching the GeoJSON file:", error)
      );
  } else {
    fetch("data/tracts_features_upstate.geojson")
      .then((response) => response.json())
      .then((data) => {
        const features = getFeatures();
        clusterFeatures(data, features);
      })
      .catch((error) =>
        console.error("Error fetching the GeoJSON file:", error)
      );
  }

  // // Update cluster legend
  // if (btn.classList.contains("cluster-map")) {
  //   updateClusterLegend(clusterLegendMap);
  // } else {
  //   updateClusterLegend(clusterLegendMap2);
  // }
});

// cluster legend is moved to Select section when continue button is clicked
cluster.querySelector(".footerbar__button").addEventListener("click", () => {
  const clonedlegendMap = clusterLegendMap.cloneNode(true);
  const clonedlegendMap2 = clusterLegendMap2.cloneNode(true);

  const select = document.querySelector("#select");
  select.appendChild(clonedlegendMap);
  select.appendChild(clonedlegendMap2);
});

function getFeatures() {
  const features = [];
  document
    .querySelector("#cluster")
    .querySelector(".cluster-container")
    .querySelectorAll(".dataset__item")
    .forEach((item) => {
      features.push(item.querySelector("p").innerText.toLowerCase());
    });
  return features;
}

function clusterFeatures(dataset, features) {
  fetch("http://127.0.0.1:5501/cluster_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataset: dataset,
      n_clusters: 4,
      features: features,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}
