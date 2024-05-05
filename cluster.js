// Iterate Cluster 1,2,3
for (let i = 0; i < 3; i++) {
  const cluster = document.querySelector(`#cluster${i + 1}`);
  const clusterBtn = cluster.querySelector(".sidebar__button");
  const continueBtn = cluster.querySelector(".footerbar__button");
  const section = configs.map3.sections.find(
    (sec) => sec.id === `cluster${i + 1}`
  );

  // Handle cluster button to display clustering result on map1
  clusterBtn.addEventListener("click", () => {
    // Restore default settings: every cluster is checked initially
    cluster.querySelectorAll("input").forEach((input) => {
      input.checked = true;
      selectedClusters[`${preferedFactors[i]}`][input.value] = input.checked;
    });

    // Run clustering analysis logics
    showClusteringAnalysis(i);
  });

  // Select Cluster interaction
  cluster.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      selectedClusters[`${preferedFactors[i]}`][input.value] = input.checked;

      // Update Mapbox source and layer based on selected cluster
      updateKMeansLayerStyle(preferedFactors[i], section.color);

      // Update selectedTractIndexes based on selected cluster
      updateSelectedTractIndexes(cluster, i);
    });
  });

  // Handle continue button interaction
  continueBtn.addEventListener("click", () => {
    cluster.querySelectorAll("input").forEach((input) => {
      // Store selected clusters from user (save to Session Storage later)
      if (input.checked) {
        selectedClusters[`${preferedFactors[i]}`][input.value] = true;
      } else {
        selectedClusters[`${preferedFactors[i]}`][input.value] = false;
      }
    });

    // Update selectedTractIndexes based on selected cluster
    updateSelectedTractIndexes(cluster, i);

    // Run clustering analysis for the next section based on updated selectedTractIndexes
    if (i < 2) showClusteringAnalysis(i + 1);
  });
}

function updateSelectedTractIndexes(cluster, i) {
  const targetClusters = [];
  const clusters = kMeansResults[`${preferedFactors[i]}`].clusters;
  cluster.querySelectorAll("input").forEach((input) => {
    if (input.checked) targetClusters.push(input.value);
  });
  const selectedTractIndex = [];
  clusters.forEach((tract, idx) => {
    if (targetClusters.includes(tract.toString())) selectedTractIndex.push(idx);
  });
  selectedTractIndexes[`${preferedFactors[i]}`] = selectedTractIndex;
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

  // Using the ML.js library to perform K-Means clustering
  const data = geojsonFiltered.map((item) => Object.values(item.properties));
  const numberOfClusters = 4;
  const options = { seed: 10, initialization: "kmeans++", iterations: 100 };
  const kMeans = ML.KMeans(data, numberOfClusters, options);

  return kMeans;
}

function addKMeansLayer(kMeans, data, title, color) {
  // Clone and clean the data
  dataClean = structuredClone(data);
  dataClean.features.forEach((feature, idx) => {
    feature.properties = {};
    feature.properties.cluster = kMeans.clusters[idx];
  });

  // Convert the title to a hyphenated format
  titleHyphen = title.replace(/\s+/g, "-");

  // Check if the source already exists, and remove it if necessary
  if (map3.getSource(`${titleHyphen}-cluster`)) {
    map3.removeLayer(`${titleHyphen}-cluster`);
    map3.removeSource(`${titleHyphen}-cluster`);
  }

  map3.addSource(`${titleHyphen}-cluster`, {
    type: "geojson",
    data: dataClean,
  });

  map3.addLayer(
    {
      id: `${titleHyphen}-cluster`,
      type: "fill",
      source: `${titleHyphen}-cluster`,
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "cluster"], 0],
          color[0],
          ["==", ["get", "cluster"], 1],
          color[1],
          ["==", ["get", "cluster"], 2],
          color[2],
          ["==", ["get", "cluster"], 3],
          color[3],
          "#ffffff",
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );
}

function updateKMeansLayerStyle(title, color) {
  const selectedCluster = selectedClusters[title];
  titleHyphen = title.replace(/\s+/g, "-");

  const layerId = `${titleHyphen}-cluster`;
  if (map3.getLayer(layerId)) {
    map3.setPaintProperty(layerId, "fill-color", [
      "case",
      ["==", ["get", "cluster"], 0],
      selectedCluster[0] ? color[0] : "#ffffff",
      ["==", ["get", "cluster"], 1],
      selectedCluster[1] ? color[1] : "#ffffff",
      ["==", ["get", "cluster"], 2],
      selectedCluster[2] ? color[2] : "#ffffff",
      ["==", ["get", "cluster"], 3],
      selectedCluster[3] ? color[3] : "#ffffff",
      "#ffffff",
    ]);
  }
}
function showClusteringAnalysis(idx) {
  const cluster = document.querySelector(`#cluster${idx + 1}`);
  const section = configs.map3.sections.find(
    (sec) => sec.id === `cluster${idx + 1}`
  );

  // Fetch data, run kMeans clustering, and display mapping
  const fileName =
    selectedCounties === "NYC Counties"
      ? "data/tracts_features_nyc_normalized.geojson"
      : "data/tracts_features_upstate_normalized.geojson";

  fetch(fileName)
    .then((response) => response.json())
    .then((data) => {
      // Recursive Clustering: hard coded for now
      // Filter data based on the selected clusters in previous section (skip the 1st section)
      if (idx == 1) {
        const indexesCluster1 =
          selectedTractIndexes[`${preferedFactors[idx - 1]}`];
        data = filterGeoJsonByIndexes(data, indexesCluster1);
      } else if (idx == 2) {
        const indexesCluster1 =
          selectedTractIndexes[`${preferedFactors[idx - 2]}`];
        const indexesCluster2 =
          selectedTractIndexes[`${preferedFactors[idx - 1]}`];
        data = filterGeoJsonByIndexes(
          data,
          indexesCluster2.map((x) => indexesCluster1[x])
        );
      }

      // Run kmeans and display mapping
      const features = getFeatures(idx);
      const kMeans = runKMeans(data, features);

      addKMeansLayer(kMeans, data, preferedFactors[idx], section.color);

      // Store cluster inputs from user (save to Session Storage later)
      clusterFeatures[`${preferedFactors[idx]}`] = features;
      kMeansResults[`${preferedFactors[idx]}`] = kMeans;

      // Update cluster legend
      const legendMap = cluster.querySelector(".legend");
      updateClusterLegend(
        legendMap,
        preferedFactors[idx],
        kMeans.centroids,
        features,
        section.color
      );

      // Update cluster select container
      const clusterSelect = cluster.querySelector(".cluster-select");
      updateClusterSelect(clusterSelect, section.color);
    })
    .catch((error) => console.error("Error fetching the GeoJSON file:", error));
}

function updateClusterSelect(clusterSelect, color) {
  clusterSelect.querySelectorAll(".color-box").forEach((box, idx) => {
    box.style.backgroundColor = color[idx];
  });
}

function filterGeoJsonByIndexes(geoJson, indexes) {
  // Filter the features array based on the indexes
  const filteredFeatures = geoJson.features.filter((feature, idx) =>
    indexes.includes(idx)
  );
  const copiedGeoJson = structuredClone(geoJson);
  copiedGeoJson.features = filteredFeatures;

  return copiedGeoJson;
}
