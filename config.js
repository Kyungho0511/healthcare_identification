const config = {
  accessToken:
    "pk.eyJ1Ijoia2xlZTA1MTEiLCJhIjoiY2xrYnFibnNjMGV4cjNrbzRqdGg1d21sYiJ9.nN0pE1qocGhTLnD_xPuYdg",
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  theme: "light",
  sections: [
    {
      id: "start",
      layers: [
        { layer: "counties-others", opacity: 1 },
        { layer: "32counties", opacity: 0.75 },
      ],
    },
    // {
    //   id: "explore",
    //   layers: [],
    // },
  ],
  chapters: [
    {
      id: "step_start",
      category: "start",
      title: "Step1: choose your county",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-76.890336, 42.552651],
        zoom: 6.5,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [
        { layer: "counties-others", opacity: 1 },
        { layer: "32counties", opacity: 0.75 },
      ],
      onChapterExit: [
        { layer: "counties-others", opacity: 0 },
        { layer: "32counties", opacity: 0 },
      ],
    },
    {
      id: "step_explore",
      category: "explore",
      title: "Step2: explore datasets",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_explore2",
      category: "explore",
      title: "Step2: explore unserved medicaids",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_cluster",
      category: "cluster",
      title: "Step3: cluster shortage areas",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_cluster2",
      category: "cluster",
      title: "Step3: cluster shortage areas",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_select",
      category: "select",
      title: "Step4: select target areas",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 14,
        pitch: 0,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_select2",
      category: "select",
      title: "Step4: select target areas",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 17,
        pitch: 40,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "step_share",
      category: "share",
      title: "Step5: share your result",
      image: "",
      description:
        "Gyeonglidan-gil is situated near the Itaewon area, which is known for its international and multicultural atmosphere. Since the rent fee was relatively cheap compared to Itaewon, Gyeonglidan-gil attracted many young enterpreneurs and creative individuals who opened businesses catering to modern tastes. This way, the area underwent a transformation from a more traditional neighborhood to a trendy and stylish corridor.",
      legend: ``,
      location: {
        center: [-73.981864, 40.725024],
        zoom: 17,
        pitch: 40,
        bearing: 0,
      },
      alignment: "left",
      onChapterEnter: [],
      onChapterExit: [],
    },
  ],
};
