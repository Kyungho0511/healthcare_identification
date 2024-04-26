const cluster = document.querySelector("#cluster");
const clusterDatasetContainers = cluster.querySelectorAll(".sidebar__dataset");

// Mouse interaction with dataset item
clusterDatasetContainers.forEach((container) => {
  if (!container.classList.contains("selectable")) return;
});

// Handle cluster button to update cluster legend
const clusterLegendMap = cluster.querySelector(".legend-map");
const clusterLegendMap2 = cluster.querySelector(".legend-map2");

cluster.querySelectorAll(".sidebar__button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dataset = [
      // Your dataset array, for example:
      [5.1, 3.5],
      [4.9, 3.0],
      [6.2, 3.4], // etc.
    ];
    const n_clusters = 3; // Or any other number of clusters

    fetch("http://127.0.0.1:5501/cluster_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataset: dataset, n_clusters: n_clusters }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    // // Update cluster legend
    // if (btn.classList.contains("cluster-map")) {
    //   updateClusterLegend(clusterLegendMap);
    // } else {
    //   updateClusterLegend(clusterLegendMap2);
    // }
  });
});

// cluster legend is moved to Select section when continue button is clicked
cluster.querySelector(".footerbar__button").addEventListener("click", () => {
  const clonedlegendMap = clusterLegendMap.cloneNode(true);
  const clonedlegendMap2 = clusterLegendMap2.cloneNode(true);

  const select = document.querySelector("#select");
  select.appendChild(clonedlegendMap);
  select.appendChild(clonedlegendMap2);
});
