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
        if (triangles != null)
          triangles[idx].style.transform = "rotate(0deg) translateY(-10%)";
      } else {
        // collapse all dropdown menu before expanding dropdown menu
        // dropdown menu with "relational" class will open only one menu at once
        dropdownContents.forEach((content) => {
          if (!content.parentElement.classList.contains("relational")) return;
          content.style.display = "none";
        });
        triangles?.forEach((tri) => {
          if (!tri.parentElement.parentElement.classList.contains("relational"))
            return;
          tri.style.transform = "rotate(0deg) translateY(-10%)";
        });

        // expand dropdown menu
        dropdownContents[idx].style.display = "block";
        if (triangles != null)
          triangles[idx].style.transform = "rotate(90deg) translateY(-10%)";
      }
    });
  });
});

// expand dataset menu with expanded class on load
const expandedLists = document.querySelectorAll(".expanded.dataset__list");
const expandedTriangles = document.querySelectorAll(".expanded.triangle");
expandedLists.forEach((list) => (list.style.display = "block"));
expandedTriangles.forEach(
  (triangle) => (triangle.style.transform = "rotate(90deg) translateY(-10%)")
);

/**
 * Selectable dataset menu interaction
 */
document.querySelectorAll(".sidebar__dataset").forEach((container) => {
  if (!container.classList.contains("selectable")) return;

  container.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      // Deselect all data
      container.querySelectorAll("p").forEach((item) => {
        item.classList.remove("selectedData");
      });

      // Highlight selected data
      event.target.classList.add("selectedData");
    }
  });
});
