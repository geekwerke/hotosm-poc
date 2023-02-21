import { useEffect, useMemo, useRef, useState } from "react";
import FreeDraw, { ALL, NONE } from "leaflet-freedraw";
import PropTypes from "prop-types";
import L from "leaflet";

import { useMapContext } from "./Map";

function useFreeDraw() {
  const { map } = useMapContext();

  const freeDrawLayer = useRef(null);

  const [latLngs, setLatLngs] = useState([]);
  const actions = useMemo(
    () => ({
      idle() {
        freeDrawLayer.current?.mode(NONE);
      },
      draw() {
        freeDrawLayer.current?.mode(ALL);
      },
    }),
    []
  );

  useEffect(() => {
    freeDrawLayer.current = new FreeDraw({
      mode: NONE,
      maximumPolygons: 1,
    });

    freeDrawLayer.current.on("markers", (event) => {
      setLatLngs(event.latLngs);
    });

    map.addLayer(freeDrawLayer.current);

    return () => map.removeLayer(freeDrawLayer.current);
  }, [map]);

  useEffect(() => {
    const polygon = L.polygon(latLngs);
    map.addLayer(polygon);
    return () => map.removeLayer(polygon);
  }, [map, latLngs]);

  return { latLngs, actions };
}

function DrawLayer({ editable }) {
  const { actions } = useFreeDraw();

  useEffect(() => {
    if (editable) actions.draw();
    else actions.idle();
  }, [actions, editable]);
}

DrawLayer.propTypes = {
  editable: PropTypes.bool,
};

DrawLayer.defaultProps = {
  editable: false,
};

export default DrawLayer;
