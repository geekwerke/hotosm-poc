import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";
import ZoomControl from "./components/ZoomControl";
import DrawLayer from "./components/DrawLayer";
import ProjectPanel from "./components/ProjectPanel";
import { useCallback, useRef, useReducer } from "react";

const initialState = {
  status: "idle", // "idle" | "editing" | "created" | "generated"
  latLngs: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "edit:start":
      return { ...state, status: "editing" };
    case "edit:change":
      return { ...state, latLngs: action.latLngs };
    case "edit:done":
      return { ...state, status: "created" };
    default:
      return state;
  }
}

function App() {
  const [{ status, latLngs }, dispatch] = useReducer(reducer, initialState);
  const drawLayerRef = useRef(null);

  const canFinishEditing = latLngs.length !== 0;
  const handleEditChange = useCallback(
    (latLngs) =>
      dispatch({
        type: "edit:change",
        latLngs,
      }),
    []
  );
  const handleEditClear = useCallback(() => {
    drawLayerRef.current?.clear();
  }, []);
  const handleEditDone = useCallback(() => {
    dispatch({ type: "edit:done" });
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
          isEditing={status === "editing"}
          onEdit={handleEditChange}
        />
      </Map>
      <ProjectPanel
        isEditing={status === "editing"}
        onEdit={() => dispatch({ type: "edit:start" })}
        onClear={handleEditClear}
        onDone={handleEditDone}
        canFinishEditing={canFinishEditing}
        hasFinishedEditing={status === "created"}
      />
    </main>
  );
}

export default App;
