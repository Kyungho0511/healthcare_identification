// Iterate Cluster 1,2,3
for (let i = 0; i < 3; i++) {
  const cluster = document.querySelector(`#cluster${i + 1}`);
  const clusterDatasetContainers =
    cluster.querySelectorAll(".sidebar__dataset");
  const clusterBtn = cluster.querySelector(".sidebar__button");
  const continueBtn = cluster.querySelector(".footerbar__button");

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
    // Collapse cluster dropdown menu
    const triangles = clusterBtn.parentElement.querySelectorAll(".triangle");
    const dropdownContents =
      clusterBtn.parentElement.querySelectorAll(".dropdown-content");
    dropdownContents.forEach((content) => (content.style.display = "none"));
    triangles.forEach(
      (tri) => (tri.style.transform = "rotate(0deg) translateY(-10%)")
    );
    const fileNames =
      selectedCounties === "NYC Counties"
        ? "data/tracts_features_nyc_normalized.geojson"
        : "data/tracts_features_upstate_normalized.geojson";

    fetch(fileNames)
      .then((response) => response.json())
      .then((data) => {
        // Run kmeans and display mapping
        const features = getFeatures(i);
        const kMeans = runKMeans(data, features);
        addKMeansLayer(kMeans, data, preferedFactors[i]);

        // Store selected cluster features from user (save to Session Storage later)
        clusterFeatures[`${preferedFactors[i]}`] = features;

        // Update cluster legend
        const legendMap = cluster.querySelector(".legend-map");
        legendMap.classList.remove("invisible");
        updateClusterLegend(
          legendMap,
          preferedFactors[i],
          kMeans.centroids,
          features
        );

        // Update cluster select container
        const clusterSelect = cluster.querySelector(".cluster-select");
        clusterSelect.classList.remove("invisible");
        updateClusterSelect(clusterSelect);
      })
      .catch((error) =>
        console.error("Error fetching the GeoJSON file:", error)
      );
  });

  // Handle continue button interaction
  continueBtn.addEventListener("click", () => {
    cluster.querySelectorAll("input").forEach((input) => {
      // Store selected clusters from user (save to Session Storage later)
      if (input.checked) {
        selectedClusters[`${preferedFactors[i]}`].push(input.value);
      }
    });
  });
}

function getFeatures(clusterIdx) {
  const features = [];
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
  const options = { initialization: "kmeans++", iterations: 100 };
  const kMeans = ML.KMeans(data, numberOfClusters, options);
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

function updateClusterSelect(clusterSelect) {
  clusterSelect.querySelectorAll(".color-box").forEach((box, idx) => {
    box.style.backgroundColor = color.yellow.categorized[idx];
  });
}
