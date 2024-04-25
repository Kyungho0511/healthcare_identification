// Listen to window popstate for browser history
window.addEventListener("popstate", function (event) {
  if (event.state == null) {
    showSection("start");
    checkProgress("start");
    onLayers("start");
    onLayersMap2("start");
    onLegend("start", "map");
    onLegend("start", "map2");
  }

  if (event.state && event.state.section) {
    const sectionId = event.state.section;
    showSection(event.state.section);
    checkProgress(sectionId);
    onLayers(sectionId);
    onLayersMap2(sectionId);
    onLegend(sectionId, "map");
    onLegend(sectionId, "map2");
  }
});

// Handle direct navigation (when a user enters a URL directly into the browser or refreshes the page)
document.addEventListener("DOMContentLoaded", function () {
  const sectionId = window.location.hash.replace("#", "");
  if (!sectionId) {
    map.on("load", () => {
      checkProgress("start");
      onLayers("start");
      onLayersMap2("start");
      onLegend("start", "map");
      onLegend("start", "map2");
    });
    return;
  }
  showSection(sectionId);

  map.on("load", () => {
    checkProgress(sectionId);
    onLayers(sectionId);
    onLayersMap2(sectionId);
    onLegend(sectionId, "map");
    onLegend(sectionId, "map2");
    if (sectionId !== "start") {
      enableSyncMap();
    }
  });
});

function navigateToSection(sectionId) {
  // Modify the URL without reloading the page
  const url = `#${sectionId}`;
  const newState = { section: sectionId };
  history.pushState(newState, "", url);
  showSection(sectionId);
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".content");
  sections.forEach((section) => {
    section.classList.remove("selected");
  });

  // Show the selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("selected");
  }
}

const progressSteps = [];
Array.from(document.querySelector(".progressbar").children).forEach((step) => {
  progressSteps.push(step.innerText.toLowerCase());
});

function checkProgress(sectionId) {
  const stepNumber = progressSteps.indexOf(sectionId) + 1;
  const progressbar = document.querySelectorAll(".progressbar");
  progressbar.forEach((bar) => {
    const steps = bar.querySelectorAll("li");
    steps.forEach((step, index) => {
      if (index < stepNumber) {
        step.classList.add("checked");
      } else {
        step.classList.remove("checked");
      }

      if (index + 1 < stepNumber) {
        step.classList.add("progressed");
      } else {
        step.classList.remove("progressed");
      }
    });
  });
}

function resetProgress() {
  const steps = document.querySelectorAll(".progressbar li");
  steps.forEach((step) => {
    step.classList.remove("checked");
    step.classList.remove("progressed");
  });
}
