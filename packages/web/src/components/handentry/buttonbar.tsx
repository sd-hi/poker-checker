import { RequestOptions } from "https";
import React from "react";
import { submitRoundResult } from "../../api/roundresult";
import { IRoundData, roundDataClearCards, roundDataCopy } from "./rounddata";

export interface IHandEntryButtonBarProps {
  roundData: IRoundData;
  setRoundData: (roundData: IRoundData) => void;
}

const HandEntryButtonBar = ({
  roundData,
  setRoundData,
}: IHandEntryButtonBarProps) => {
  // Bar with functions

  const handleSubmitRoundResult = (): void => {
    // Submit round result to API
    submitRoundResult(roundData);
  };

  const handleButtonClear = () => {
    // Handle user clicking Clear button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataClearCards(newRoundData);
    setRoundData(newRoundData);
  };

  return (
    <div className="button-bar">
      <button className="btn btn-primary" onClick={handleSubmitRoundResult}>
        Submit
      </button>
      <button className="btn btn-secondary" onClick={handleButtonClear}>
        Clear
      </button>
      <button className="btn btn-secondary">Undo</button>
      <button className="btn btn-secondary">Random</button>
    </div>
  );
};

export default HandEntryButtonBar;
