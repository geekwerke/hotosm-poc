import { useCallback, useRef, useReducer } from "react";

import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";
import ZoomControl from "./components/ZoomControl";
import DrawLayer from "./components/DrawLayer";
import ProjectPanel from "./components/ProjectPanel";

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
};

const initialState = {
  status: AppStatus.IDLE,
  latLngs: [],
};

function reducer(state, action) {
  switch (action.type) {
    case AppAction.DRAW_STARTED:
      return { ...state, status: AppStatus.DRAWING };
    case AppAction.DRAW_CHANGED:
      return { ...state, latLngs: action.latLngs };
    case AppAction.DRAW_DONE:
      return { ...state, status: AppStatus.EDITING };
    default:
      return state;
  }
}

function App() {
  const [{ status, latLngs }, dispatch] = useReducer(reducer, initialState);
  const drawLayerRef = useRef(null);

  const canFinishDrawing = latLngs.length !== 0;
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

  return (
    <main className="relative">
      <Map className="fullscreen">
        <Controls>
          <LocateControl />
          <ZoomControl />
        </Controls>
        <DrawLayer
          ref={drawLayerRef}
          status={status}
          latLngs={latLngs}
          onDrawChange={handleDrawChange}
        />
      </Map>
      <ProjectPanel
        status={status}
        onDrawStart={() => dispatch({ type: AppAction.DRAW_STARTED })}
        onDrawClear={handleDrawClear}
        onDrawDone={handleDrawDone}
        canFinishDrawing={canFinishDrawing}
      />
    </main>
  );
}

export { AppStatus, AppAction };

export default App;
