function updateLegend(title, scaleMin, scaleMax, bound) {
  title.innerText = bound.name;
  scaleMin.innerText = bound.min;
  scaleMax.innerText = bound.max;
}

function updateClusterLegend(legend) {
  const list = legend.querySelector(".cluster-legend-list");

  // Vulnerability cluster
  if (legend.classList.contains("cluster-legend-map")) {
    // update cluster list items here!
  }

  // Profitability cluster
  if (legend.classList.contains("cluster-legend-map2")) {
    // update cluster list items here!
  }
}

// Retrieve categorized colors from config and update cluster color-boxes with them
const colorBoxesMap = clusterLegendMap.querySelectorAll(".color-box");
const colorBoxesMap2 = clusterLegendMap2.querySelectorAll(".color-box");

colorBoxesMap.forEach((box, idx) => {
  box.style.backgroundColor = color.yellow.categorized[idx];
});
colorBoxesMap2.forEach((box, idx) => {
  box.style.backgroundColor = color.blue.categorized[idx];
});
