const BACKEND_API_BASE_URL = "http://localhost:8000";

async function getTaskSplit(latLngsDrawn, subTasks) {
  const response = await fetch(`${BACKEND_API_BASE_URL}/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: createRequestBody(latLngsDrawn, subTasks),
  });

  return response.json();
}

// Helpers

function createRequestBody(latLngs, subTasks) {
  const body = {
    boundary: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [latLngs[0].map(({ lat, lng }) => [lng, lat])],
            type: "Polygon",
          },
        },
      ],
    },
    params: {
      subTasks,
      splitBy: ["roads"],
    },
  };
  return JSON.stringify(body);
}

export { getTaskSplit };
