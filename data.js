/**
 * Dropdown dataset menu interaction
 */
const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const triangle = document.querySelector(".triangle");

dropdownButton.onclick = function () {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
  triangle.style.transform =
    dropdownContent.style.display === "block"
      ? "rotate(90deg) translateY(-10%)"
      : "rotate(0deg) translateY(-10%)";
};

// Highlight selected data
const datasetLists = document.querySelectorAll(".dataset__list");
datasetLists.forEach((list) => {
  list.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      event.target.classList.contains("selectedData")
        ? event.target.classList.remove("selectedData")
        : event.target.classList.add("selectedData");
    }
  });
});

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

/**
 * Explore section
 */
const explore = document.querySelector("#explore");
const exploreDatasetList = start.querySelector(".dataset__list");

// fill dataset container with layers on the mapbox studio
map.on("load", () => {});
