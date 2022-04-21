import React from "react";

const ButtonBar = () => {
  // Bar with functions
  return <div className="button-bar">
    <button className="btn btn-primary">Submit</button>
    <button className="btn btn-secondary">Clear</button>
    <button className="btn btn-secondary">Undo</button>
    <button className="btn btn-secondary">Random</button>
  </div>;
};

export default ButtonBar;
