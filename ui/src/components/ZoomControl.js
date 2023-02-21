import classNames from "classnames";

import { useMapContext } from "./Map";
import ZoomInIcon from "./icons/ZoomInIcon";
import ZoomOutIcon from "./icons/ZoomOutIcon";

function ZoomControl({ className }) {
  const { map } = useMapContext();

  const handleZoomIn = () => {
    map.zoomIn();
  };
  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="button-group">
      <button
        className={classNames("secondary centered", className)}
        onClick={handleZoomIn}
      >
        <ZoomInIcon />
      </button>
      <button
        className={classNames("secondary centered", className)}
        onClick={handleZoomOut}
      >
        <ZoomOutIcon />
      </button>
    </div>
  );
}

export default ZoomControl;
