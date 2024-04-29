// Iterate Cluster 1,2,3
for (let i = 0; i < 3; i++) {
  const cluster = document.querySelector(`#cluster${i + 1}`);
  const clusterDatasetContainers =
    cluster.querySelectorAll(".sidebar__dataset");
  const clusterBtn = cluster.querySelector(".sidebar__button");

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

  // Handle cluster button to display clustering result on map1
  clusterBtn.addEventListener("click", () => {
    const fileName =
      selectedCounties === "NYC Counties"
        ? "data/tracts_features_nyc.geojson"
        : "data/tracts_features_upstate.geojson";

    fetch(fileName)
      .then((response) => response.json())
      .then((data) => {
        // Run kmeans and display mapping
        const features = getFeatures(i);
        const kMeans = runKMeans(data, features);
        addKMeansLayer(kMeans, data, preferedFactors[i]);

        // Update cluster legend
        const legendMap = cluster.querySelector(".legend-map");
        legendMap.classList.remove("invisible");
        updateClusterLegend(legendMap, preferedFactors[i], kMeans.centroids);

        // Update cluster select container
        const clusterSelect = cluster.querySelector(".cluster-select");
        clusterSelect.classList.remove("invisible");
      })
      .catch((error) =>
        console.error("Error fetching the GeoJSON file:", error)
      );
  });
}

function getFeatures(clusterIdx) {
  const features = [];

  console.log(
    document
      .querySelector(`#cluster${clusterIdx + 1}`)
      .querySelector(".cluster-dataset")
  );

  document
    .querySelector(`#cluster${clusterIdx + 1}`)
    .querySelector(".features-to-cluster")
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
  const kMeans = ML.KMeans(data, numberOfClusters);

  return kMeans;
}

function addKMeansLayer(kMeans, data, title) {
  // Clone and clean the data
  dataClean = structuredClone(data);
  dataClean.features.forEach((feature, idx) => {
    feature.properties = {};
    feature.properties.cluster = kMeans.clusters[idx];
  });

  // Convert the title to a hyphenated format
  titleCopy = title.replace(/\s+/g, "-");

  // Check if the source already exists, and remove it if necessary
  if (map.getSource(`${titleCopy}-cluster`)) {
    map.removeLayer(`${titleCopy}-cluster`);
    map.removeSource(`${titleCopy}-cluster`);
  }

  map.addSource(`${titleCopy}-cluster`, {
    type: "geojson",
    data: dataClean,
  });

  map.addLayer(
    {
      id: `${titleCopy}-cluster`,
      type: "fill",
      source: `${titleCopy}-cluster`,
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
