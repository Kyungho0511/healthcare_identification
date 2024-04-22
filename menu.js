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

// Control visibility of the select-counties dropbutton titles based on interaction
document.querySelectorAll(".select-counties").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("added")) {
      // dehighlight select counties title
      btn.classList.remove("added");
    } else {
      // dehighlight all select counties before highlight the target title
      document
        .querySelectorAll(".select-counties")
        .forEach((btn) => btn.classList.remove("added"));
      btn.classList.add("added");
    }
  });
});

const expandedLists = document.querySelectorAll(".expanded.dataset__list");
const expandedTriangles = document.querySelectorAll(".expanded.triangle");

// expand selected_dataset menu on load
expandedLists.forEach((list) => (list.style.display = "block"));
expandedTriangles.forEach(
  (triangle) => (triangle.style.transform = "rotate(90deg) translateY(-10%)")
);
