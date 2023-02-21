function createElement(tagName, props, ...children) {
  let element = document.createElement(tagName);

  if (props) Object.assign(element, props);

  for (let child of children) {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }

  return element;
}

export { createElement };
