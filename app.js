// Handle logo button interaction
const logos = document.querySelectorAll(".logo");
logos.forEach((logo) => {
  logo.addEventListener("click", () => {
    navigateToSection("start");
    resetProgress();
    onLayers("start", "map");
    onLayers("start", "map2");
    window.location.reload();
  });
});

// Handle continue(footerbar) button interaction
const sections = document.querySelectorAll(".content");
const sectionIds = [];
sections.forEach((sec) => sectionIds.push(sec.id));

sections.forEach((sec, idx) => {
  const btn = sec.querySelector(".footerbar__button");
  btn.addEventListener("click", () => {
    // Edge case:
    if (idx == 0) {
      navigateToSection(`${sectionIds[idx + 1]}`);
      checkProgress(`${sectionIds[idx + 1]}`);
      onLayers(`${sectionIds[idx + 1]}`, "map");
      onLayers(`${sectionIds[idx + 1]}`, "map2");
      onLegend(`${sectionIds[idx + 1]}`, "map");
      onLegend(`${sectionIds[idx + 1]}`, "map2");
      flyTo();
      enableSyncMap();
    } else if (idx == sectionIds.length - 1) {
      console.log("share!");
    }

    // Normal case:
    else {
      navigateToSection(`${sectionIds[idx + 1]}`);
      checkProgress(`${sectionIds[idx + 1]}`);
      onLayers(`${sectionIds[idx + 1]}`, "map");
      onLayers(`${sectionIds[idx + 1]}`, "map2");
      onLegend(`${sectionIds[idx + 1]}`, "map");
      onLegend(`${sectionIds[idx + 1]}`, "map2");
    }
  });
});

// Listen to window popstate for browser history
window.addEventListener("popstate", function (event) {
  if (event.state == null) {
    showSection("start");
    checkProgress("start");
    onLayers("start", "map");
    onLayers("start", "map2");
    onLegend("start", "map");
    onLegend("start", "map2");
  }

  if (event.state && event.state.section) {
    const sectionId = event.state.section;
    showSection(event.state.section);
    checkProgress(sectionId);
    onLayers(sectionId, "map");
    onLayers(sectionId, "map2");
    onLegend(sectionId, "map");
    onLegend(sectionId, "map2");
  }
});

// Handle direct navigation (when a user enters a URL directly into the browser or refreshes the page)
document.addEventListener("DOMContentLoaded", function () {
  // On page load, retrieve the selected counties from sessionStorage
  if (sessionStorage.getItem("selectedCounties")) {
    selectedCounties = JSON.parse(sessionStorage.getItem("selectedCounties"));
  }

  const sectionId = window.location.hash.replace("#", "");
  if (!sectionId) {
    map.on("load", () => {
      checkProgress("start");
      onLayers("start", "map");
      onLayers("start", "map2");
      onLegend("start", "map");
      onLegend("start", "map2");
    });
    return;
  }
  showSection(sectionId);

  map.on("load", () => {
    checkProgress(sectionId);
    onLayers(sectionId, "map");
    onLayers(sectionId, "map2");
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
  sections.forEach((section) => {
    section.classList.remove("selected");
  });

  // Show the selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("selected");
  }
}

// Control progressbars
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
