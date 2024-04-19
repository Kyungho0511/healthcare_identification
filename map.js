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
const alignments = {
  left: "lefty",
  center: "centered",
  right: "righty",
};

/**
 * Main 'story' and header/footer
 */
const story = document.querySelector("#story");
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
const footer = document.querySelector("#footer");
const buttonSkip = document.querySelector("#button_skip");

/**
 * Features
 */
const features = document.createElement("div");
features.classList.add(alignments[config.alignment]);
features.setAttribute("id", "features");

config.chapters.forEach((record, idx) => {
  const container = document.createElement("div");
  const chapter = document.createElement("div");

  // Creates the title for the vignettes
  if (record.title) {
    const title = document.createElement("h3");
    title.innerText = record.title;
    chapter.appendChild(title);
  }

  // Creates the image for the vignette
  if (record.image) {
    const image = new Image();
    image.src = record.image;
    chapter.appendChild(image);
  }

  // Creates the description for the vignette
  if (record.description) {
    const story = document.createElement("p");
    story.innerHTML = record.description;
    chapter.appendChild(story);
  }

  // Sets the id for the vignette and adds the step css attribute
  container.setAttribute("id", record.id);
  container.classList.add(alignments[record.alignment]);
  container.classList.add("step");
  if (idx === 0) {
    container.classList.add("active");
  }

  // Sets the overall theme to the chapter element
  chapter.classList.add(config.theme);
  container.appendChild(chapter);
  features.appendChild(container);
});

// Appends the features element (with the vignettes) to the story element
story.insertBefore(features, footer);

/**
 * Mapbox & Scrollama
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

const map = new mapboxgl.Map({
  container: "map",
  style: config.style,
  center: config.chapters[0].location.center,
  zoom: config.chapters[0].location.zoom,
  bearing: config.chapters[0].location.bearing,
  pitch: config.chapters[0].location.pitch,
  scrollZoom: true,
  minZoom: 6.3,
  transformRequest: transformRequest,
});
// Disable rotation using touch and mouse
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

// Instantiates the scrollama function
const scroller = scrollama();

map.on("load", function () {
  // Run mapbox associated scrollama logic only when current section is home
  if (currentSection == "home") {
    // Setup the instance, pass callback functions
    scroller
      .setup({
        step: ".step",
        offset: 0.5,
        progress: true,
        preventDefault: true,
      })
      .onStepEnter((response) => {
        let chapter = config.chapters.find(
          (chap) => chap.id === response.element.id
        );
        map.flyTo(chapter.location);

        if (chapter.onChapterEnter.length > 0) {
          chapter.onChapterEnter.forEach(setLayerOpacity);
        }

        // Hightlight the selected navbar item
        const selected = document.querySelector(`#navbar_${chapter.category}`);
        selectNavItem(selected);
      })
      .onStepExit((response) => {
        let chapter = config.chapters.find(
          (chap) => chap.id === response.element.id
        );

        if (chapter.onChapterExit.length > 0) {
          chapter.onChapterExit.forEach(setLayerOpacity);
        }
      });
  }
});

/* Here we watch for any resizing of the screen to
  adjust our scrolling setup */
window.addEventListener("resize", () => {
  if (currentSection == "home") scroller.resize();
});

function getLayerPaintType(layer) {
  const layerType = map.getLayer(layer).type;
  return layerTypes[layerType];
}
function setLayerOpacity(layer) {
  console.log(layer);
  const paintProps = getLayerPaintType(layer.layer);
  paintProps.forEach(function (prop) {
    map.setPaintProperty(layer.layer, prop, layer.opacity);
  });
}

// Navbar interactivity as scrolling
document.addEventListener("scroll", navbarScrollHandler);
document.addEventListener("scroll", footerScrollHandler);

function navbarScrollHandler() {
  if (currentSection == "home") {
    if (window.scrollY > 0) {
      navbar.classList.remove("highlight");
    } else {
      navbar.classList.add("highlight");
      resetProgress();
    }
  }
}

function footerScrollHandler() {
  const footerTop = footer.offsetTop;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;

  // Control buttonSkip visibility based on the scroll position
  if (scrollTop + viewportHeight >= footerTop || scrollTop == 0) {
    offButton(buttonSkip);
  } else if (scrollTop + viewportHeight < footerTop && scrollTop > 0) {
    onButton(buttonSkip);
  }
}

function offButton(button) {
  button.style.opacity = 0;
  button.style.pointerEvents = "none";
}

function onButton(button) {
  button.style.opacity = 1;
  button.style.pointerEvents = "auto";
}

function selectNavItem(selected) {
  deselectNavItems();
  selected.classList.add("active");
}

function deselectNavItems() {
  const navItems = navbar.querySelectorAll("a");
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove("active");
  }
}

function flyTo(sectionId) {
  if (sectionId == "start") {
    map.jumpTo(config.chapters[0].location);
  } else if (
    sectionId == "explore" ||
    sectionId == "cluster1" ||
    sectionId == "cluster2"
  ) {
    map.flyTo({
      center: [-73.981864, 40.725024],
      zoom: 12,
      pitch: 0,
      bearing: 0,
    });
  } else if (sectionId == "select") {
    map.flyTo({
      center: [-73.981864, 40.725024],
      zoom: 14,
      pitch: 0,
      bearing: 0,
    });
  } else if (sectionId == "share") {
    map.flyTo({
      center: [-73.981864, 40.725024],
      zoom: 17,
      pitch: 40,
      bearing: 0,
    });
  }
}

function onLayers(sectionId) {
  map.once("render", () => {
    offLayers();
    let section = config.sections.find((sec) => sec.id === sectionId);
    section?.layers?.forEach((layer) => {
      setLayerOpacity({ layer: layer, opacity: 1 });
    });
  });
}

function offLayers() {
  config.sections.forEach((sec) => {
    sec.layers?.forEach((layer) => {
      setLayerOpacity({ layer: layer, opacity: 0 });
    });
  });
}

// Hover effect (mapbox studio duplicates feature ids by mistake, when uploading geojson)
// solution: set id states with a unique feature property for every geometry within feature
// then in setPaintProperty, do self-reference. so features with the same id are uniquely identifiable.
map.on("load", () => {
  setHoverPaintProperty("32counties-outline", "id");
});

function onHover(chapter, feature) {
  if (chapter.id === "background") {
    for (let i = 0; i < 27; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "insurance_percent-bokrxj",
          id: i,
        },
        { id: feature.properties.id }
      );
    }
  } else if (chapter.id === "background2" || chapter.id === "disparity_index") {
    for (let i = 0; i < 60; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_counties-cn3p9u",
          id: i,
        },
        { id: feature.properties.id }
      );
    }
  } else if (chapter.id === "disparity_index2") {
    for (let i = 0; i < 7; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_counties_filter-606o8r",
          id: i,
        },
        { id: feature.properties.id }
      );
    }
  } else if (chapter.id === "site2") {
    for (let i = 0; i < 40; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_density_montgomery-8wfbcr",
          id: i,
        },
        { id: feature.properties.area }
      );
    }
  } else if (chapter.id === "site3") {
    for (let i = 0; i < 5; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "neighbors_disparity-8ptuyk",
          id: i,
        },
        { id: feature.properties.id }
      );
    }
  }
}

function offHover(chapter) {
  // delete id states for every geometry within feature
  if (chapter.id === "background") {
    for (let i = 0; i < 27; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "insurance_percent-bokrxj",
          id: i,
        },
        { id: null }
      );
    }
  } else if (chapter.id === "background2" || chapter.id === "disparity_index") {
    for (let i = 0; i < 60; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_counties-cn3p9u",
          id: i,
        },
        { id: null }
      );
    }
  } else if (chapter.id === "disparity_index2") {
    for (let i = 0; i < 7; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_counties_filter-606o8r",
          id: i,
        },
        { id: null }
      );
    }
  } else if (chapter.id === "site2") {
    for (let i = 0; i < 40; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "medicaid_density_montgomery-8wfbcr",
          id: i,
        },
        { id: null }
      );
    }
  } else if (chapter.id === "site3") {
    for (let i = 0; i < 5; i++) {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "neighbors_disparity-8ptuyk",
          id: i,
        },
        { id: null }
      );
    }
  }
}

function setHoverPaintProperty(layer, property) {
  map.setPaintProperty(layer, "line-width", [
    "case",
    ["==", ["get", property], ["feature-state", "id"]],
    4,
    0,
  ]);
}
