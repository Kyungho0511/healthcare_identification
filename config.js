const legendPrice = document.querySelector("#legend_price");

const config = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  theme: "light",
  chapters: [
    {
      id: "step_county1",
      title: "Step1: choose your county",
      progress: 1,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 11.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_explore1",
      title: "Step2: explore datasets",
      progress: 2,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_explore2",
      title: "Step2: explore unserved medicaids",
      progress: 2,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_cluster1",
      title: "Step3: cluster shortage areas",
      progress: 3,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 13.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_cluster2",
      title: "Step3: cluster shortage areas",
      progress: 3,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 13.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_select1",
      title: "Step4: select target areas",
      progress: 4,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 13.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_select2",
      title: "Step4: select target areas",
      progress: 4,
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 13.39,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
  ],
};
