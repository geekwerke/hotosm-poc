import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";
import ZoomControl from "./components/ZoomControl";

function App() {
  return (
    <Map className="fullscreen">
      <Controls>
        <LocateControl />
        <ZoomControl />
      </Controls>
    </Map>
  );
}

export default App;
