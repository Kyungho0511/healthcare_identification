/**
 * Start section
 */
function updateLegend(title, scaleMin, scaleMax, bound) {
  title.innerText = bound.name;
  scaleMin.innerText = bound.min;
  scaleMax.innerText = bound.max;
}
