const map2 = new mapboxgl.Map({
  container: "map2",
  style: config.style,
  center: [-75.652367, 42.202986],
  zoom: 70,
  bearing: 0,
  pitch: 0,
  scrollZoom: true,
  transformRequest: transformRequest,
});

map2.on("load", function () {
  // This is the function that finds the first symbol layer
  const layers = map2.getStyle().layers;
  var firstSymbolId;
  for (let i = 0; i < layers.length; i++) {
    // console.log(layers[i].id);
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  // map.flyTo(chapter.location);
  // setLayerOpacity(layername)
});
