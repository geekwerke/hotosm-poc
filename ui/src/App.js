import Map from "./components/Map";
import Controls from "./components/Controls";
import LocateControl from "./components/LocateControl";

function App() {
  return (
    <Map className="fullscreen">
      <Controls>
        <LocateControl />
      </Controls>
    </Map>
  );
}

export default App;
