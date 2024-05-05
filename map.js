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
// map.dragRotate.disable();
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

// Sync Map, Map2 navigation
enableSyncMap();

const map3 = new mapboxgl.Map({
  container: "map3",
  style: config3.style,
  center: config3.location.center,
  zoom: config3.location.zoom,
  bearing: config3.location.bearing,
  pitch: config3.location.pitch,
  scrollZoom: true,
  maxBounds: bounds,
  transformRequest: transformRequest,
});

// Disable rotation using touch and mouse
map3.dragRotate.disable();
map3.touchZoomRotate.disableRotation();

/**
 * Functions
 */
function getLayerPaintType(layer, mapId) {
  const layerType =
    mapId === "map" ? map.getLayer(layer).type : map2.getLayer(layer).type;
  return layerTypes[layerType];
}

function setLayerOpacity(layer, mapId) {
  const paintProps = getLayerPaintType(layer.layer, mapId);
  paintProps.forEach(function (prop) {
    if (mapId === "map") map.setPaintProperty(layer.layer, prop, layer.opacity);
    else if (mapId === "map2")
      map2.setPaintProperty(layer.layer, prop, layer.opacity);
    else if (mapId === "map3")
      map3.setPaintProperty(layer.layer, prop, layer.opacity);
  });
}

function onMaps(sectionId) {
  if (sectionId === "start" || sectionId === "explore") {
    document.querySelector("#map").classList.remove("invisible");
    document.querySelector("#map2").classList.remove("invisible");
    document.querySelector("#map3").classList.add("invisible");
  } else {
    document.querySelector("#map").classList.add("invisible");
    document.querySelector("#map2").classList.add("invisible");
    document.querySelector("#map3").classList.remove("invisible");
    map3.resize();
  }
}

function onLayers(sectionId, mapId) {
  // Update layer opacity
  offLayerOpacity(mapId);

  let section = null;
  if (mapId === "map") {
    section = config.sections.find((sec) => sec.id === sectionId);
  } else if (mapId === "map2") {
    section = config2.sections.find((sec) => sec.id === sectionId);
  } else if (mapId === "map3") {
    section = config2.sections.find((sec) => sec.id === sectionId);
  }

  section?.layers.forEach((layer) => {
    setLayerOpacity(layer, mapId);
  });

  // Update layer style (Start)
  if (sectionId === "start") {
    const defaultLayer = "counties-nyc";
    const defaultAttribute = section.default.attribute;
    const defaultBound = layerBoundsCountiesNYC[0];
    const defaultColor = section.default.color;
    updateLayerStyle(
      defaultLayer,
      defaultAttribute,
      defaultBound.min,
      defaultBound.max,
      defaultColor.min,
      defaultColor.max,
      defaultBound.rateOfChange,
      mapId
    );
  }

  // Update layer style (Explore)
  else if (sectionId === "explore") {
    const defaultLayer =
      selectedCounties === "NYC Counties"
        ? "tracts-features-nyc"
        : "tracts-features-upstate";
    const defaultAttribute = section.default?.attribute;
    const defaultBound =
      selectedCounties === "NYC Counties"
        ? layerBoundsTractsNYC.find((bound) => bound.name === defaultAttribute)
        : layerBoundsTractsUpstate.find(
            (bound) => bound.name === defaultAttribute
          );
    const defaultColor = section.default?.color;
    if (section.default) {
      updateLayerStyle(
        defaultLayer,
        defaultAttribute,
        defaultBound.min,
        defaultBound.max,
        defaultColor.min,
        defaultColor.max,
        defaultBound.rateOfChange,
        mapId
      );
    }
  }

  // Update layer visibility
  ToggleLayerVisiblity();
}

function offLayerOpacity(mapId) {
  if (mapId === "map") {
    config.sections.forEach((sec) => {
      sec.layers.forEach((layer) => {
        setLayerOpacity({ layer: layer.layer, opacity: 0 }, mapId);
      });
    });
  } else {
    config2.sections.forEach((sec) => {
      sec.layers.forEach((layer) => {
        setLayerOpacity({ layer: layer.layer, opacity: 0 }, mapId);
      });
    });
  }
}

function ToggleLayerVisiblity() {
  if (selectedCounties === "NYC Counties") {
    map.setLayoutProperty("tracts-features-nyc", "visibility", "visible");
    map2.setLayoutProperty("tracts-features-nyc", "visibility", "visible");
    map3.setLayoutProperty("tracts-features-nyc", "visibility", "visible");
    map.setLayoutProperty("tracts-features-upstate", "visibility", "none");
    map2.setLayoutProperty("tracts-features-upstate", "visibility", "none");
    map3.setLayoutProperty("tracts-features-upstate", "visibility", "none");
  } else {
    map.setLayoutProperty("tracts-features-nyc", "visibility", "none");
    map2.setLayoutProperty("tracts-features-nyc", "visibility", "none");
    map3.setLayoutProperty("tracts-features-nyc", "visibility", "none");
    map.setLayoutProperty("tracts-features-upstate", "visibility", "visible");
    map2.setLayoutProperty("tracts-features-upstate", "visibility", "visible");
    map3.setLayoutProperty("tracts-features-upstate", "visibility", "visible");
  }
}

function syncMap(sourceMap, targetMap) {
  return function () {
    const center = sourceMap.getCenter();
    const zoom = sourceMap.getZoom();
    const bearing = sourceMap.getBearing();
    const pitch = sourceMap.getPitch();

    // Temporarily disable the listener on the target map
    targetMap.off("move", targetMap.sync);

    // Update the target map's view
    targetMap.jumpTo({
      center: center,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
    });

    // Re-enable the listener on the target map after the update
    requestAnimationFrame(() => {
      if (isSyncing) {
        // Check to avoid re-binding if syncing has been disabled
        targetMap.on("move", targetMap.sync);
      }
    });
  };
}

function enableSyncMap() {
  if (isSyncing) return; // Prevent multiple sync initializations
  isSyncing = true;

  // Only attach handlers if syncing isn't already enabled
  map.sync = syncMap(map, map2);
  map2.sync = syncMap(map2, map);

  map.on("move", map.sync);
  map2.on("move", map2.sync);
}

function disableSyncMap() {
  if (isSyncing) {
    map.off("move", map.sync);
    map2.off("move", map2.sync);

    map.sync = null;
    map2.sync = null;

    isSyncing = false; // Reset syncing state
  }
}

function updateLayerStyle(
  layer,
  attribute,
  min,
  max,
  colorMin,
  colorMax,
  rateOfChange,
  mapId
) {
  if (mapId === "map") {
    map.setPaintProperty(layer, "fill-color", [
      "interpolate",
      rateOfChange,
      ["get", attribute],
      min,
      colorMin,
      max,
      colorMax,
    ]);
  } else {
    map2.setPaintProperty(layer, "fill-color", [
      "interpolate",
      rateOfChange,
      ["get", attribute],
      min,
      colorMin,
      max,
      colorMax,
    ]);
  }
}

function flyTo() {
  if (selectedCounties === "NYC Counties") {
    map.jumpTo(config.location);
    map2.jumpTo(config.location);
  } else if (selectedCounties === "Upstate NY Counties") {
    map.jumpTo(config2.location);
    map2.jumpTo(config2.location);
  }
}

function flyReset() {
  map.jumpTo(config.location);
  map2.jumpTo(config2.location);
}

function selectFeatureByName(layerId, propertyName, value) {
  const features = map.queryRenderedFeatures({
    layers: [layerId],
  });
  const selectedFeature = features.find(
    (feature) => feature.properties[propertyName] === value
  );

  return selectedFeature;
}
