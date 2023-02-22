import { useCallback, useEffect, useRef, useReducer } from "react";
import L from "leaflet";

import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";
import ZoomControl from "./components/ZoomControl";
import DrawLayer from "./components/DrawLayer";
import ProjectPanel from "./components/ProjectPanel";
import { getTaskSplit } from "./server";

const AppStatus = {
  IDLE: "idle",
  // User is drawing a project boundary.
  DRAWING: "drawing",
  // User is editing project params.
  EDITING: "editing",
  // User is generating task boundaries.
  GENERATING: "generating",
};

const AppAction = {
  DRAW_STARTED: "draw:started",
  DRAW_CHANGED: "draw:changed",
  DRAW_DONE: "draw:done",

  EDIT_TASK_RANGE_CHANGED: "edit:task-range-changed",

  GENERATE_STARTED: "generate:started",
  GENERATE_DONE: "generate:done",

  RESET: "reset",
};

const initialState = {
  status: AppStatus.IDLE,
  latLngsDrawn: [],

  tasks: 5,
  geojsonGenerated: null,
};

function reducer(state, action) {
  switch (action.type) {
    case AppAction.DRAW_STARTED:
      return { ...state, status: AppStatus.DRAWING };
    case AppAction.DRAW_CHANGED:
      return { ...state, latLngsDrawn: action.latLngs };
    case AppAction.DRAW_DONE:
      return { ...state, status: AppStatus.EDITING };
    case AppAction.EDIT_TASK_RANGE_CHANGED:
      return { ...state, tasks: action.tasks };
    case AppAction.GENERATE_STARTED:
      return { ...state, status: AppStatus.GENERATING };
    case AppAction.GENERATE_DONE:
      return {
        ...state,
        status: AppStatus.EDITING,
        geojsonGenerated: action.geojson,
      };
    case AppAction.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

function App() {
  const [{ status, latLngsDrawn, tasks, geojsonGenerated }, dispatch] =
    useReducer(reducer, initialState);

  const mapRef = useRef(null);
  const drawLayerRef = useRef(null);

  // Fix for a bug in Leaflet.FreeDraw where the polygon
  // drawn does not get added to the map.
  useEffect(() => {
    const polygon = L.polygon(latLngsDrawn);
    mapRef.current?.addLayer(polygon);
    return () => mapRef.current?.removeLayer(polygon);
  }, [latLngsDrawn]);

  useEffect(() => {
    if (!geojsonGenerated) return;

    const geojsonLayer = L.geoJSON(geojsonGenerated);
    mapRef.current?.addLayer(geojsonLayer);
    return () => mapRef.current?.removeLayer(geojsonLayer);
  }, [geojsonGenerated]);

  const canFinishDrawing = latLngsDrawn.length !== 0;
  const hasFinishedDrawing =
    status !== AppStatus.DRAWING && latLngsDrawn.length !== 0;
  const handleDrawChange = useCallback(
    (latLngs) =>
      dispatch({
        type: AppAction.DRAW_CHANGED,
        latLngs,
      }),
    []
  );
  const handleDrawClear = useCallback(() => {
    drawLayerRef.current?.clear();
  }, []);
  const handleDrawDone = useCallback(() => {
    dispatch({ type: AppAction.DRAW_DONE });
  }, []);
  const handleTaskRangeChange = useCallback(
    (tasks) => dispatch({ type: AppAction.EDIT_TASK_RANGE_CHANGED, tasks }),
    []
  );
  const handleGenerate = useCallback(async () => {
    dispatch({ type: AppAction.GENERATE_STARTED });
    const { split } = await getTaskSplit(latLngsDrawn, tasks);
    dispatch({ type: AppAction.GENERATE_DONE, geojson: split });
  }, [latLngsDrawn, tasks]);
  const handleReset = useCallback(() => {
    dispatch({ type: AppAction.RESET });
    drawLayerRef.current?.clear();
  }, []);

  return (
    <main className="relative">
      <Map ref={mapRef} className="fullscreen">
        <Controls>
          <LocateControl />
          <ZoomControl />
        </Controls>
        <DrawLayer
          ref={drawLayerRef}
          status={status}
          latLngs={latLngsDrawn}
          onDrawChange={handleDrawChange}
        />
      </Map>
      <ProjectPanel
        status={status}
        onDrawStart={() => dispatch({ type: AppAction.DRAW_STARTED })}
        onDrawClear={handleDrawClear}
        onDrawDone={handleDrawDone}
        canFinishDrawing={canFinishDrawing}
        hasFinishedDrawing={hasFinishedDrawing}
        tasks={tasks}
        onTaskRangeChange={handleTaskRangeChange}
        onGenerate={handleGenerate}
        onReset={handleReset}
      />
    </main>
  );
}

export { AppStatus, AppAction };

export default App;
