import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";
import ZoomControl from "./components/ZoomControl";
import DrawLayer from "./components/DrawLayer";

function App() {
  return (
    <Map className="fullscreen">
      <Controls>
        <LocateControl />
        <ZoomControl />
      </Controls>
      <DrawLayer editable />
    </Map>
  );
}

export default App;
