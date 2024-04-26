const start = document.querySelector("#start");
const upstateCountiesContainer = start.querySelector(".upstate_counties");
const nycCountiesContainer = start.querySelector(".nyc_counties");

// Temporary: adding a group of counties at once
const selectCountiesBtn = start.querySelectorAll(".select-counties");
selectCountiesBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Store selected counties to session storage
    selectedCounties = btn.innerText;
    sessionStorage.setItem(
      "selectedCounties",
      JSON.stringify(selectedCounties)
    );

    // Activate continue button when user selected counties
    start.querySelector(".footerbar__button").disabled = true;
    selectCountiesBtn.forEach((btn) => {
      if (btn.classList.contains("added")) {
        start.querySelector(".footerbar__button").disabled = false;
      }
    });
  });
});

// Color dataset items with theme color
upstateCountiesContainer.querySelectorAll("p").forEach((p) => {
  p.style.color = color.yellow.max;
});
nycCountiesContainer.querySelectorAll("p").forEach((p) => {
  p.style.color = color.yellow.max;
});
