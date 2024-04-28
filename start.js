const start = document.querySelector("#start");
const startContinueBtn = start.querySelector(".footerbar__button");

// Prevent users to choose the same option for questionnaires
document
  .querySelectorAll('input[name="most-important"]')
  .forEach(function (radio) {
    radio.addEventListener("change", function () {
      // Enable all options in the second list
      document
        .querySelectorAll('input[name="second-important"]')
        .forEach(function (input) {
          input.disabled = false;
          input.parentElement.classList.remove("radio-disabled");
        });

      // Disable the matching option in the second list
      const selectedValue = this.value;
      const toDisable = document.querySelector(
        'input[name="second-important"][value="' + selectedValue + '"]'
      );
      if (toDisable) {
        toDisable.disabled = true;
        toDisable.checked = false;
        toDisable.parentElement.classList.add("radio-disabled");
      }
    });
  });

// Activate continue button when user chooses all options
startContinueBtn.disabled = true;

const mostImportantRadios = document.querySelectorAll(
  'input[name="most-important"]'
);
const secondImportantRadios = document.querySelectorAll(
  'input[name="second-important"]'
);
const countiesRadios = document.querySelectorAll('input[name="counties"]');

const allRadioGroups = [
  mostImportantRadios,
  secondImportantRadios,
  countiesRadios,
];

allRadioGroups.forEach((group) => {
  group.forEach((radio) => {
    radio.addEventListener("change", checkAllSelected);
  });
});

function checkAllSelected() {
  const allSelected = allRadioGroups.every((group) =>
    Array.from(group).some((radio) => radio.checked)
  );

  // activate continue button
  if (allSelected) {
    startContinueBtn.disabled = false;
  }
}

startContinueBtn.addEventListener("click", () => {
  // Store user inputs to session storage (user input variables are declared in config.js)
  countiesRadios.forEach((radio) => {
    if (radio.checked) selectedCounties = radio.value;
  });
  const tempFactors = [];
  mostImportantRadios.forEach((radio) => {
    if (radio.checked) tempFactors.push(radio.value);
  });
  secondImportantRadios.forEach((radio) => {
    if (radio.checked) tempFactors.push(radio.value);
  });
  preferedFactors.forEach((factor) => {
    if (!tempFactors.includes(factor)) tempFactors.push(factor);
  });

  preferedFactors = tempFactors;
  sessionStorage.setItem("selectedCounties", JSON.stringify(selectedCounties));
  sessionStorage.setItem("preferedFactors", JSON.stringify(preferedFactors));

  onLayers("explore", "map");
  onLayers("explore", "map2");
  flyTo();
  enableSyncMap();
  setClusterContent();
});

function setClusterContent() {
  // Set Cluster1,2,3 sections based on user inputs
  for (let i = 0; i < 3; i++) {
    const cluster = document.querySelector(`#cluster${i + 1}`);

    // Set title
    cluster.querySelector(
      ".dataset-title"
    ).innerHTML = `${preferedFactors[i]} clustering`;

    // Set list of features
    const list = document.createElement("ul");
    if (preferedFactors[i] === "vulnerability") {
      vulnerabilityFeatures.forEach((feature) =>
        createItem(list, feature, "minus")
      );
    } else if (preferedFactors[i] === "profitability") {
      profitabilityFeatures.forEach((feature) =>
        createItem(list, feature, "minus")
      );
    } else if (preferedFactors[i] === "built environment") {
      builtEnvironmentFeatures.forEach((feature) =>
        createItem(list, feature, "minus")
      );
    }
    cluster.querySelector(".dataset__list").innerHTML = list.innerHTML;
  }
}
