import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import Leaflet from "leaflet";
import PropTypes from "prop-types";

const MapContext = createContext();
const useMapContext = () => useContext(MapContext);

function Map({ center, className, zoom, ...rest }) {
  const [context, setContext] = useState(null);

  const mapRef = useCallback((mapContainer) => {
    if (mapContainer !== null) {
      const map = Leaflet.map(mapContainer).setView(center, zoom);

      map.zoomControl.setPosition("topright");

      Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      setContext({ map });
    }

    // This effect must only run once on initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => context?.map.remove();
  }, [context]);

  return (
    <MapContext.Provider value={context}>
      <div
        className={classNames("relative", className)}
        ref={mapRef}
        {...rest}
      />
    </MapContext.Provider>
  );
}

Map.propTypes = {
  center: PropTypes.array,
  className: PropTypes.string,
  zoom: PropTypes.number,
};

Map.defaultProps = {
  center: [12.9716, 77.5946],
  className: null,
  zoom: 12,
};

export { useMapContext };

export default Map;
