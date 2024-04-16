// Default section on load
let currentSection = "home";

// Listen to window popstate for browser history
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.section) {
    showSection(event.state.section);
  }
});

// Handle direct navigation (when a user enters a URL directly into the browser or refreshes the page)
document.addEventListener("DOMContentLoaded", function () {
  const sectionId = window.location.hash.replace("#", "");
  if (!sectionId) return;
  if (sectionId.substring(0, 4) == "step") showSection("home");
  else showSection(sectionId);
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

function checkProgress(stepNumber) {
  const steps = document.querySelectorAll(".progressbar li");
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
}

function resetProgress() {
  const steps = document.querySelectorAll(".progressbar li");
  steps.forEach((step) => {
    step.classList.remove("checked");
    step.classList.remove("progressed");
  });
}
