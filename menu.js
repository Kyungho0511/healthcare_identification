/**
 * Dropdown dataset menu interaction
 */
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  const dropdownButtons = dropdown.querySelectorAll(".dropbtn");
  const dropdownContents = dropdown.querySelectorAll(".dropdown-content");
  const triangles = dropdown.querySelectorAll(".triangle");

  dropdownButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      if (dropdownContents[idx].style.display === "block") {
        // collapse dropdown menu
        dropdownContents[idx].style.display = "none";
        triangles[idx].style.transform = "rotate(0deg) translateY(-10%)";
      } else {
        // collapse all dropdown menu before expanding dropdown menu
        dropdownContents.forEach((content) => {
          content.style.display = "none";
        });
        triangles.forEach((tri) => {
          tri.style.transform = "rotate(0deg) translateY(-10%)";
        });

        // expand dropdown menu
        dropdownContents[idx].style.display = "block";
        triangles[idx].style.transform = "rotate(90deg) translateY(-10%)";
      }
    });
  });
});

const expandedLists = document.querySelectorAll(".expanded.dataset__list");
const expandedTriangles = document.querySelectorAll(".expanded.triangle");

// expand dataset menu with expanded class on load
expandedLists.forEach((list) => (list.style.display = "block"));
expandedTriangles.forEach(
  (triangle) => (triangle.style.transform = "rotate(90deg) translateY(-10%)")
);

/**
 * Start
 */
// Temporary: Control visibility of the select-counties dropbutton titles based on interaction
document.querySelectorAll(".select-counties").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("added")) {
      // dehighlight select-counties title
      btn.classList.remove("added");

      // dehighlight map overlay
    } else {
      // dehighlight all select-counties before highlight the target title
      document
        .querySelectorAll(".select-counties")
        .forEach((btn) => btn.classList.remove("added"));
      // dehighlight all map overlays

      // highlight select-counties title
      btn.classList.add("added");
      // highlight map overlay
    }
  });
});
