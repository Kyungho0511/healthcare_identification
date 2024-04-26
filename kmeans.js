async function runKMeans() {
  const data = [
    [1, 2],
    [1, 4],
    [1, 0],
    [4, 2],
    [4, 4],
    [4, 0],
  ];

  const response = await fetch("http://127.0.0.1:5000/kmeans?n_clusters=2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const result = await response.json();
    console.log("Cluster Centers:", result.centers);
    console.log("Labels:", result.labels);
  } else {
    console.error("Failed to fetch:", response.statusText);
  }
}
