import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import FreeDraw, { ALL, NONE } from "leaflet-freedraw";
import L from "leaflet";

import { useMapContext } from "./Map";

const DrawLayerWithRef = forwardRef(function DrawLayer(props, ref) {
  const { isEditing, onEdit } = props;
  const { map } = useMapContext();

  const freeDrawLayer = useRef(null);
  const [latLngs, setLatLngs] = useState([]);

  useImperativeHandle(ref, () => freeDrawLayer.current, []);

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
  }, [onEdit, map]);

  useEffect(() => {
    if (isEditing) freeDrawLayer.current?.mode(ALL);
    else freeDrawLayer.current?.mode(NONE);
  }, [isEditing]);

  useEffect(() => {
    const polygon = L.polygon(latLngs);
    map.addLayer(polygon);
    return () => map.removeLayer(polygon);
  }, [map, latLngs]);

  useEffect(() => {
    onEdit(latLngs);
  }, [onEdit, latLngs]);

  return null;
});

export default DrawLayerWithRef;
