/**
 * Toggle background datasets
 */
const uninsured_2010 = document.querySelector("#uninsured_2010");
const uninsured_2022 = document.querySelector("#uninsured_2022");
const medicaid_2010 = document.querySelector("#medicaid_2010");
const medicaid_2022 = document.querySelector("#medicaid_2022");
const uninsured_legend_states = document.querySelector(
  "#uninsured_legend_states"
);
const medicaid_legend_states = document.querySelector(
  "#medicaid_legend_states"
);

uninsured_2010.addEventListener("click", () => {
  offLayersBackground();
  setLayerOpacity({ layer: "uninsured-percent-2010", opacity: 1.0 });
  medicaid_legend_states.classList.add("invisible");
  uninsured_legend_states.classList.remove("invisible");
});
uninsured_2022.addEventListener("click", () => {
  offLayersBackground();
  setLayerOpacity({ layer: "uninsured-percent-2022", opacity: 1.0 });
  medicaid_legend_states.classList.add("invisible");
  uninsured_legend_states.classList.remove("invisible");
});
medicaid_2010.addEventListener("click", () => {
  offLayersBackground();
  setLayerOpacity({ layer: "medicaid-percent-2010", opacity: 1.0 });
  medicaid_legend_states.classList.remove("invisible");
  uninsured_legend_states.classList.add("invisible");
});
medicaid_2022.addEventListener("click", () => {
  offLayersBackground();
  setLayerOpacity({ layer: "medicaid-percent-2022", opacity: 1.0 });
  medicaid_legend_states.classList.remove("invisible");
  uninsured_legend_states.classList.add("invisible");
});

function offLayersBackground() {
  setLayerOpacity({ layer: "uninsured-percent-2022", opacity: 0 });
  setLayerOpacity({ layer: "uninsured-percent-2010", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-percent-2022", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-percent-2010", opacity: 0 });
}

/**
 * Toggle background2 datasets
 */
const medicaid_2012 = document.querySelector("#medicaid_2012");
const medicaid_2021 = document.querySelector("#medicaid_2021");
const acceptance_2012 = document.querySelector("#acceptance_2012");
const acceptance_2021 = document.querySelector("#acceptance_2021");
const medicaid_legend_counties = document.querySelector(
  "#medicaid_legend_counties"
);
const acceptance_legend_counties = document.querySelector(
  "#acceptance_legend_counties"
);

medicaid_2012.addEventListener("click", () => {
  offLayersBackground2();
  setLayerOpacity({ layer: "medicaid-percent-counties-2012", opacity: 1.0 });
  acceptance_legend_counties.classList.add("invisible");
  medicaid_legend_counties.classList.remove("invisible");
});
medicaid_2021.addEventListener("click", () => {
  offLayersBackground2();
  setLayerOpacity({ layer: "medicaid-percent-counties-2021", opacity: 1.0 });
  acceptance_legend_counties.classList.add("invisible");
  medicaid_legend_counties.classList.remove("invisible");
});
acceptance_2012.addEventListener("click", () => {
  offLayersBackground2();
  setLayerOpacity({ layer: "medicaid-accept-counties-2012", opacity: 1.0 });
  acceptance_legend_counties.classList.remove("invisible");
  medicaid_legend_counties.classList.add("invisible");
});
acceptance_2021.addEventListener("click", () => {
  offLayersBackground2();
  setLayerOpacity({ layer: "medicaid-accept-counties-2021", opacity: 1.0 });
  acceptance_legend_counties.classList.remove("invisible");
  medicaid_legend_counties.classList.add("invisible");
});

function offLayersBackground2() {
  setLayerOpacity({ layer: "medicaid-percent-counties-2012", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-percent-counties-2021", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-accept-counties-2012", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-accept-counties-2021", opacity: 0 });
}

/**
 * Toggle site datasets
 */
const shortage_2021 = document.querySelector("#shortage_2021");
const disparity_2021 = document.querySelector("#disparity_2021");
const shortage_legend_counties = document.querySelector(
  "#shortage_legend_counties"
);
const disparity_legend_counties = document.querySelector(
  "#disparity_legend_counties"
);

shortage_2021.addEventListener("click", () => {
  setLayerOpacity({ layer: "medicaid-disparity-counties-2021", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-shortage-counties-2021", opacity: 1.0 });
  shortage_legend_counties.classList.remove("invisible");
  disparity_legend_counties.classList.add("invisible");
});
disparity_2021.addEventListener("click", () => {
  setLayerOpacity({ layer: "medicaid-shortage-counties-2021", opacity: 0 });
  setLayerOpacity({ layer: "medicaid-disparity-counties-2021", opacity: 1.0 });
  shortage_legend_counties.classList.add("invisible");
  disparity_legend_counties.classList.remove("invisible");
});