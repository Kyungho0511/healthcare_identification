const start = document.querySelector("#start");
const startContinueBtn = start.querySelector(".footerbar__button");

document
  .querySelectorAll('input[name="most-important"]')
  .forEach(function (radio) {
    radio.addEventListener("change", function () {
      // Enable all options in the second list
      document
        .querySelectorAll('input[name="least-important"]')
        .forEach(function (input) {
          input.disabled = false;
          input.parentElement.classList.remove("radio-disabled");
        });

      // Disable the matching option in the second list
      const selectedValue = this.value;
      const toDisable = document.querySelector(
        'input[name="least-important"][value="' + selectedValue + '"]'
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
const leastImportantRadios = document.querySelectorAll(
  'input[name="least-important"]'
);
const countiesRadios = document.querySelectorAll('input[name="counties"]');

const allRadioGroups = [
  mostImportantRadios,
  leastImportantRadios,
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

// Store user inputs to session storage (user input variables are declared in config.js)
startContinueBtn.addEventListener("click", () => {
  countiesRadios.forEach((radio) => {
    if (radio.checked) selectedCounties = radio.value;
  });

  const tempFactors = [...preferedFactors];
  mostImportantRadios.forEach((radio) => {
    if (radio.checked) tempFactors[0] = radio.value;
  });
  leastImportantRadios.forEach((radio) => {
    if (radio.checked) tempFactors[tempFactors.length - 1] = radio.value;
  });

  const uniqueArray = Array.from(new Set(tempFactors));
  preferedFactors.forEach((factor) => {
    if (!uniqueArray.includes(factor)) tempFactors[1] = factor;
  });

  preferedFactors = tempFactors;

  sessionStorage.setItem("selectedCounties", JSON.stringify(selectedCounties));
  sessionStorage.setItem("preferedFactors", JSON.stringify(preferedFactors));

  onLayers("explore", "map");
  onLayers("explore", "map2");
  flyTo();
  enableSyncMap();
});
