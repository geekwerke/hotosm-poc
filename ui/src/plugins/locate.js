import L from "leaflet";

import { createElement } from "../helpers/dom";

L.Control.Locate = L.Control.extend({
  options: {
    position: "topright",
  },

  initialize(options) {
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    const element = createElement("button", {
      className: "fmtm-control-locate secondary",
      onclick: (event) => this.handleLocate(event, map),
    });
    element.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24" fill="none">
        <path fill="#fff" d="M7 0h2v16H7V0Z"/>
        <path fill="#fff" d="M16 7v2H0V7h16Z"/>
        <path fill="#fff" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"/>
        <path fill="#596b78" d="M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0Z"/>
        <path fill="#fff" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/>
      </svg>
    `.trim();
    return element;
  },

  handleLocate(_event, map) {
    map.locate({ setView: true, maxZoom: 12 });
  },
});

L.control.locate = function (options) {
  return new L.Control.Locate(options);
};
