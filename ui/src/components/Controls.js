import classNames from "classnames";
import React from "react";

function Controls({ children }) {
  const mappedChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      className: classNames("pointer-events-auto", child.props.className),
    })
  );

  return (
    <div className="stack stack-row gap-xs absolute top-md right-md pointer-events-none z-controls">
      {mappedChildren}
    </div>
  );
}

export default Controls;
