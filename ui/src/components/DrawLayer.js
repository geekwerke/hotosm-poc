import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import FreeDraw, { ALL, NONE } from "leaflet-freedraw";

import { AppStatus } from "../App";
import { useMapContext } from "./Map";

const DrawLayer = forwardRef(function ({ status, onDrawChange }, ref) {
  const { map } = useMapContext();

  // Expose the layer outside the component.
  const freeDrawLayer = useRef(null);
  useImperativeHandle(ref, () => freeDrawLayer.current, []);

  // Initialise layer and listen for events.
  useEffect(() => {
    freeDrawLayer.current = new FreeDraw({
      mode: NONE,
      maximumPolygons: 1,
    });

    freeDrawLayer.current.on("markers", (event) => {
      onDrawChange(event.latLngs);
    });

    map.addLayer(freeDrawLayer.current);

    return () => map.removeLayer(freeDrawLayer.current);
  }, [onDrawChange, map]);

  // Toggle mode between editing and viewing.
  const isDrawing = status === AppStatus.DRAWING;
  useEffect(() => {
    if (isDrawing) freeDrawLayer.current?.mode(ALL);
    else freeDrawLayer.current?.mode(NONE);
  }, [isDrawing]);

  return null;
});

export default DrawLayer;
