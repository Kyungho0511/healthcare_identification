/**
 * Start section
 */
const start = document.querySelector("#start");
const startDatasetList = start.querySelector(".dataset__list");

// fill dataset container with layers on the mapbox studio
map.on("load", () => {
  const layer = map.getLayer("32counties");
  const features = map.queryRenderedFeatures({ layers: [layer.id] });
  features.forEach((feature) => {
    const li = document.createElement("li");
    li.classList.add("dataset__item");
    li.innerText = feature.properties.NAME;
    startDatasetList.appendChild(li);
  });
});

// highlight selected data
startDatasetList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.contains("selectedData")
      ? event.target.classList.remove("selectedData")
      : event.target.classList.add("selectedData");
  }
});

/**
 * Explore section
 */
