import classNames from "classnames";

import LocateIcon from "./icons/LocateIcon";
import { useMapContext } from "./Map";

function LocateControl({ className }) {
  const { map } = useMapContext();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 12 });
  };

  return (
    <button
      className={classNames("secondary rounded-full centered", className)}
      onClick={handleClick}
    >
      <LocateIcon size={24} />
    </button>
  );
}

export default LocateControl;
