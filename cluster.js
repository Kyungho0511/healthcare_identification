for (let i = 0; i < 3; i++) {
  const cluster = document.querySelector(`#cluster${i + 1}`);
  const clusterDatasetContainers =
    cluster.querySelectorAll(".sidebar__dataset");
  const clusterBtn = cluster.querySelector(".sidebar__button");
  const clusterLegendMap = cluster.querySelector(".legend-map");
  const clusterLegendMap2 = cluster.querySelector(".legend-map2");

  // Mouse interaction with dataset item
  clusterDatasetContainers.forEach((container) => {
    if (!container.classList.contains("selectable")) return;
    setDataMappingInteraction(
      cluster,
      container,
      color.yellow.min,
      color.yellow.max,
      "map2"
    );
  });

  // Handle cluster button to update cluster legend (map1)
  clusterBtn.addEventListener("click", () => {
    if (selectedCounties === "NYC Counties") {
      fetch("data/tracts_features_nyc.geojson")
        .then((response) => response.json())
        .then((data) => {
          const features = getFeatures();
          const kMeans = runKMeans(data, features);
          addKMeansLayer(kMeans, data);
        })
        .catch((error) =>
          console.error("Error fetching the GeoJSON file:", error)
        );
    } else {
      fetch("data/tracts_features_upstate.geojson")
        .then((response) => response.json())
        .then((data) => {
          const features = getFeatures();
          const kmeans = runKMeans(data, features);
          addKMeansLayer(kmeans, data);
        })
        .catch((error) =>
          console.error("Error fetching the GeoJSON file:", error)
        );
    }

    // // Update cluster legend
    //   updateClusterLegend(clusterLegendMap);
  });

  // Retrieve categorized colors from config and update cluster color-boxes with them
  const colorBoxesMap = cluster
    .querySelector(".legend-map")
    .querySelectorAll(".color-box");

  colorBoxesMap.forEach((box, idx) => {
    box.style.backgroundColor = color.yellow.categorized[idx];
  });
}

function getFeatures() {
  const features = [];
  document
    .querySelector("#cluster1")
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

  // Number of clusters
  const numberOfClusters = 4;

  // Using the ML.js library to perform K-Means clustering
  const kmeans = ML.KMeans(data, numberOfClusters);

  return kmeans;
}

function addKMeansLayer(kmeans, data) {
  dataClean = structuredClone(data);
  dataClean.features.forEach((feature, idx) => {
    feature.properties = {};
    feature.properties.cluster = kmeans.clusters[idx];
  });
  map.addSource("vulnerability-cluster", {
    type: "geojson",
    data: dataClean,
  });

  console.log(kmeans.centroids);

  map.addLayer(
    {
      id: "vulnerability-cluster",
      type: "fill",
      source: "vulnerability-cluster",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "cluster"], 0],
          color.yellow.categorized[0],
          ["==", ["get", "cluster"], 1],
          color.yellow.categorized[1],
          ["==", ["get", "cluster"], 2],
          color.yellow.categorized[2],
          ["==", ["get", "cluster"], 3],
          color.yellow.categorized[3],
          "#ffffff",
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );
}
