import React from "react";
import { IRoundData, roundDataCopy } from "./rounddata";
import { roundDataClearCards } from "./rounddata";

export interface IHandEntryButtonBarProps {
  roundData: IRoundData;
  setRoundData: (roundData: IRoundData) => void;
}

const HandEntryButtonBar = ({ roundData, setRoundData }: IHandEntryButtonBarProps) => {
  // Bar with functions

  const handleButtonClear = () => {
    // Handle user clicking Clear button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataClearCards(newRoundData);
    setRoundData(newRoundData);
  };

  return (
    <div className="button-bar">
      <button className="btn btn-primary">Submit</button>
      <button className="btn btn-secondary" onClick={handleButtonClear}>
        Clear
      </button>
      <button className="btn btn-secondary">Undo</button>
      <button className="btn btn-secondary">Random</button>
    </div>
  );
};

export default HandEntryButtonBar;
