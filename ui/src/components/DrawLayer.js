import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import FreeDraw, { ALL, NONE } from "leaflet-freedraw";
import L from "leaflet";

import { AppStatus } from "../App";
import { useMapContext } from "./Map";

const DrawLayer = forwardRef(function ({ latLngs, status, onDrawChange }, ref) {
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

  // Fix for a bug in Leaflet.FreeDraw where the polygon
  // drawn does not get added to the map.
  useEffect(() => {
    const polygon = L.polygon(latLngs);
    map.addLayer(polygon);
    return () => map.removeLayer(polygon);
  }, [map, latLngs]);

  return null;
});

export default DrawLayer;
