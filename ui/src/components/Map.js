import Leaflet from "leaflet";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const MapContext = createContext();
const useMapContext = () => useContext(MapContext);

function Map() {
  const [context, setContext] = useState(null);

  const mapRef = useCallback((mapContainer) => {
    if (mapContainer !== null) {
      const map = Leaflet.map(mapContainer).setView([51.505, -0.09], 13);

      Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      setContext({ map });
    }
  }, []);

  useEffect(() => {
    return () => context?.map.remove();
  }, [context]);

  return (
    <MapContext.Provider value={context}>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
    </MapContext.Provider>
  );
}

export { useMapContext };

export default Map;
