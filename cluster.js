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
        runKMeans(data, features);
      })
      .catch((error) =>
        console.error("Error fetching the GeoJSON file:", error)
      );
  } else {
    fetch("data/tracts_features_upstate.geojson")
      .then((response) => response.json())
      .then((data) => {
        const features = getFeatures();
        runKMeans(data, features);
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

function runKMeans(geojson, propertyNames) {
  // Filter geojson basedon features
  const geojsonFiltered = geojson.features.map((feature) => {
    let filteredProperties = {};
    propertyNames.forEach((prop) => {
      if (feature.properties.hasOwnProperty(prop)) {
        filteredProperties[prop] = feature.properties[prop];
      }
    });
    return {
      ...feature,
      properties: filteredProperties,
    };
  });

  // Convert array of properties objects to 2d array
  const data = [];
  geojsonFiltered.forEach((item) => {
    const featureVals = [];
    Object.values(item.properties).forEach((val) => featureVals.push(val));
    data.push(featureVals);
  });

  console.log(data);
  console.log(propertyNames);

  // Number of clusters
  const numberOfClusters = 4;

  // Using the ML.js library to perform K-Means clustering
  const kmeans = ML.KMeans(data, numberOfClusters);

  // // Output the results
  console.log("Cluster Centers:", kmeans.centroids);
  console.log("Cluster Assignments:", kmeans.clusters);
}
