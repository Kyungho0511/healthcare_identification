// Iterate Cluster 1,2,3
for (let i = 0; i < 3; i++) {
  const cluster = document.querySelector(`#cluster${i + 1}`);
  const clusterDatasetContainers =
    cluster.querySelectorAll(".sidebar__dataset");
  const clusterBtn = cluster.querySelector(".sidebar__button");
  const continueBtn = cluster.querySelector(".footerbar__button");

  // Mouse interaction with dataset item (map2)
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

    // Restore default settings: every cluster is checked initially
    cluster.querySelectorAll("input").forEach((input) => {
      input.checked = true;
      selectedClusters[`${preferedFactors[i]}`][input.value] = input.checked;
    });

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
        if (i == 1) {
          const indexes = selectedTractIndexes[`${preferedFactors[i - 1]}`];
          data = filterGeoJsonByIndexes(data, indexes);
        } else if (i == 2) {
          const indexesCluster1 =
            selectedTractIndexes[`${preferedFactors[i - 2]}`];
          const indexesCluster2 =
            selectedTractIndexes[`${preferedFactors[i - 1]}`];
          data = filterGeoJsonByIndexes(
            data,
            indexesCluster2.map((x) => indexesCluster1[x])
          );
        }

        // Run kmeans and display mapping
        const features = getFeatures(i);
        const kMeans = runKMeans(data, features);

        addKMeansLayer(kMeans, data, preferedFactors[i]);

        // Store cluster inputs from user (save to Session Storage later)
        clusterFeatures[`${preferedFactors[i]}`] = features;
        kMeansResults[`${preferedFactors[i]}`] = kMeans;

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

  // Select Cluster interaction
  cluster.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      selectedClusters[`${preferedFactors[i]}`][input.value] = input.checked;

      // Update Mapbox source and layer based on selected cluster
      updateKMeansLayerStyle(preferedFactors[i]);

      // Update selectedTractIndexes based on selected cluster
      const targetClusters = [];
      const clusters = kMeansResults[`${preferedFactors[i]}`].clusters;
      cluster.querySelectorAll("input").forEach((input) => {
        if (input.checked) targetClusters.push(input.value);
      });
      const selectedTractIndex = [];
      clusters.forEach((tract, idx) => {
        if (targetClusters.includes(tract.toString()))
          selectedTractIndex.push(idx);
      });
      selectedTractIndexes[`${preferedFactors[i]}`] = selectedTractIndex;

      console.log(selectedTractIndex);
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

  // Using the ML.js library to perform K-Means clustering
  const data = geojsonFiltered.map((item) => Object.values(item.properties));
  const numberOfClusters = 4;
  const options = { seed: 10, initialization: "kmeans++", iterations: 100 };
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
  titleHyphen = title.replace(/\s+/g, "-");

  // Check if the source already exists, and remove it if necessary
  if (map.getSource(`${titleHyphen}-cluster`)) {
    map.removeLayer(`${titleHyphen}-cluster`);
    map.removeSource(`${titleHyphen}-cluster`);
  }

  map.addSource(`${titleHyphen}-cluster`, {
    type: "geojson",
    data: dataClean,
  });

  map.addLayer(
    {
      id: `${titleHyphen}-cluster`,
      type: "fill",
      source: `${titleHyphen}-cluster`,
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

function updateKMeansLayerStyle(title) {
  const selectedCluster = selectedClusters[title];
  titleHyphen = title.replace(/\s+/g, "-");

  const layerId = `${titleHyphen}-cluster`;
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, "fill-color", [
      "case",
      ["==", ["get", "cluster"], 0],
      selectedCluster[0] ? color.yellow.categorized[0] : "#ffffff",
      ["==", ["get", "cluster"], 1],
      selectedCluster[1] ? color.yellow.categorized[1] : "#ffffff",
      ["==", ["get", "cluster"], 2],
      selectedCluster[2] ? color.yellow.categorized[2] : "#ffffff",
      ["==", ["get", "cluster"], 3],
      selectedCluster[3] ? color.yellow.categorized[3] : "#ffffff",
      "#ffffff",
    ]);
  }
}

function updateClusterSelect(clusterSelect) {
  clusterSelect.querySelectorAll(".color-box").forEach((box, idx) => {
    box.style.backgroundColor = color.yellow.categorized[idx];
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
