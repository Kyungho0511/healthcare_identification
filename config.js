const legendPrice = document.querySelector("#legend_price");

const config = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  theme: "light",
  chapters: [
    {
      id: "low_land_price",
      title: "2015 | low land price",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [126.98257, 37.53905],
        zoom: 14.9,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
  ],
};
