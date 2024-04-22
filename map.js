const layerTypes = {
  fill: ["fill-opacity"],
  line: ["line-opacity"],
  circle: ["circle-opacity", "circle-stroke-opacity"],
  symbol: ["icon-opacity", "text-opacity"],
  raster: ["raster-opacity"],
  background: ["background-opacity"],
  symbol: ["text-opacity"],
  "fill-extrusion": ["fill-extrusion-opacity"],
};

/**
 * Mapbox
 */
mapboxgl.accessToken = config.accessToken;
const transformRequest = (url) => {
  const hasQuery = url.indexOf("?") !== -1;
  const suffix = hasQuery
    ? "&pluginName=journalismScrollytelling"
    : "?pluginName=journalismScrollytelling";
  return {
    url: url + suffix,
  };
};

const bounds = [
  [-85, 36], // Southwest coordinates
  [-65, 48], // Northeast coordinates
];

const map = new mapboxgl.Map({
  container: "map",
  style: config.style,
  center: config.location.center,
  zoom: config.location.zoom,
  bearing: config.location.bearing,
  pitch: config.location.pitch,
  scrollZoom: true,
  maxBounds: bounds,
  transformRequest: transformRequest,
});

// Disable rotation using touch and mouse
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

const map2 = new mapboxgl.Map({
  container: "map2",
  style: config2.style,
  center: config2.location.center,
  zoom: config2.location.zoom,
  bearing: config2.location.bearing,
  pitch: config2.location.pitch,
  scrollZoom: true,
  maxBounds: bounds,
  transformRequest: transformRequest,
});

// Disable rotation using touch and mouse
map2.dragRotate.disable();
map2.touchZoomRotate.disableRotation();

function getLayerPaintType(layer) {
  const layerType = map.getLayer(layer).type;
  return layerTypes[layerType];
}

function setLayerOpacity(layer) {
  const paintProps = getLayerPaintType(layer.layer);
  paintProps.forEach(function (prop) {
    map.setPaintProperty(layer.layer, prop, layer.opacity);
  });
}

function onLayers(sectionId) {
  offLayers();
  let section = config.sections.find((sec) => sec.id === sectionId);
  section?.layers?.forEach((layer) => {
    setLayerOpacity(layer);
  });
}

function offLayers() {
  config.sections.forEach((sec) => {
    sec.layers?.forEach((layer) => {
      setLayerOpacity({ layer: layer.layer, opacity: 0 });
    });
  });
}

function getLayerPaintTypeMap2(layer) {
  const layerType = map2.getLayer(layer).type;
  return layerTypes[layerType];
}

function setLayerOpacityMap2(layer) {
  const paintProps = getLayerPaintType(layer.layer);
  paintProps.forEach(function (prop) {
    map2.setPaintProperty(layer.layer, prop, layer.opacity);
  });
}

function onLayersMap2(sectionId) {
  offLayersMap2();
  let section = config2.sections.find((sec) => sec.id === sectionId);
  section?.layers?.forEach((layer) => {
    setLayerOpacityMap2(layer);
  });
}

function offLayersMap2() {
  config2.sections.forEach((sec) => {
    sec.layers?.forEach((layer) => {
      setLayerOpacityMap2({ layer: layer.layer, opacity: 0 });
    });
  });
}
