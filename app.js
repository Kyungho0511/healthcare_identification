// Default section on load
let currentSection = "home";

// Listen to window popstate for browser history
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.section) {
    showSection(event.state.section);

    // Run necessary functions to display contents based on sectionId
    const sectionId = event.state.section;
    if (sectionId !== "home" || sectionId.substring(0, 4) !== "step") {
      checkProgress(sectionId);
      flyTo(sectionId);
      onLayers(sectionId);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Handle direct navigation (when a user enters a URL directly into the browser or refreshes the page)
  const sectionId = window.location.hash.replace("#", "");
  if (!sectionId) return;
  if (sectionId.substring(0, 4) === "step") showSection("home");
  else showSection(sectionId);

  // Run necessary functions to display contents based on sectionId
  if (sectionId !== "home" || sectionId.substring(0, 4) !== "step") {
    map.on("load", () => {
      checkProgress(sectionId);
      flyTo(sectionId);
      onLayers(sectionId);
    });
  }
});

function navigateToSection(sectionId) {
  // Modify the URL without reloading the page
  const url = sectionId == "home" ? "#" : `#${sectionId}`;
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

  // Update current section
  currentSection = sectionId;

  // Change navbar state based on the section
  const navbar = document.querySelector("#navbar");
  if (sectionId == "home") {
    navbar.classList.add("highlight");
  } else {
    navbar.classList.remove("highlight");
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
