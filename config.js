const color = {
  blue: {
    categorized: ["#ebfffe", "#97d9ff", "#3399ff", "#0145ff", "#2500cc"],
    min: "#f5f9ff",
    max: "#006efe",
  },
  yellow: {
    categorized: ["#f9ffd7", "#fff767", "#ffdb39", "#ffa621", "#e27100"],
    min: "#fffaec",
    max: "#f5ab00",
  },
};

const config = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  location: {
    center: [-73.884766, 40.713326],
    zoom: 10.5,
    pitch: 0,
    bearing: 0,
  },
  sections: [
    {
      id: "start",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 0.7 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
    {
      id: "explore",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
    {
      id: "cluster",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
  ],
};

const config2 = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  location: {
    center: [-76.490336, 42.952651],
    zoom: 6.7,
    pitch: 0,
    bearing: 0,
  },
  sections: [
    {
      id: "start",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 0.7 },
        { layer: "32counties", opacity: 0.1 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
    {
      id: "explore",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
    {
      id: "cluster",
      layers: [
        { layer: "counties-others", opacity: 0.6 },
        { layer: "tracts", opacity: 1 },
        { layer: "shortage-tracts-with-features", opacity: 0.9 },
      ],
    },
  ],
};
