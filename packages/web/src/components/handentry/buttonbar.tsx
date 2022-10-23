import React from "react";
import { postRoundResult } from "../../api/roundresult";
import {
  IRoundData,
  roundDataClearCards,
  roundDataCopy,
  roundDataRandomizeCards,
} from "../shared/rounddata";

export interface IHandEntryButtonBarProps {
  roundData: IRoundData;
  setRoundData: (roundData: IRoundData) => void;
  openRoundViewer: (roundResultId: string) => void;
}

const HandEntryButtonBar = ({
  roundData,
  setRoundData,
  openRoundViewer,
}: IHandEntryButtonBarProps) => {
  // Bar with functions

  const handleSubmitRoundResult = (): void => {
    // Submit round result to API
    postRoundResult(roundData)
      .then((roundResultId) => {
        // Open round viewer for returned round result ID
        console.log("Opening round viewer with ID " + roundResultId);
        openRoundViewer(roundResultId);
      })
      .catch((reason) => console.log(reason));
  };

  const handleButtonClear = () => {
    // Handle user clicking Clear button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataClearCards(newRoundData);
    setRoundData(newRoundData);
  };

  const handleButtonRandom = () => {
    // Handle user clicking Random button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataRandomizeCards(newRoundData);
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
      <button className="btn btn-secondary" onClick={handleButtonRandom}>
        Random
      </button>
    </div>
  );
};

export default HandEntryButtonBar;
