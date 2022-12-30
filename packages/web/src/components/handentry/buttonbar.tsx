import React from "react";
import { postRoundResult } from "../../api/roundresult";
import { AlertBoxLevel } from "../shared/alertbox";
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
  showAlertBox: (level: AlertBoxLevel, message: string) => void;
  hideAlertBox: () => void;
}

const HandEntryButtonBar = ({
  roundData,
  hideAlertBox,
  openRoundViewer,
  setRoundData,
  showAlertBox,
}: IHandEntryButtonBarProps) => {
  // Bar with functions

  const handleSubmitRoundResult = (): void => {
    // Clear any prior error message
    hideAlertBox();

    // Submit round result to API
    postRoundResult(roundData)
      .then((roundResultId) => {
        // Open round viewer for returned round result ID
        console.log("Opening round viewer with ID " + roundResultId);
        openRoundViewer(roundResultId);
      })
      .catch((reason) => {
        showAlertBox(AlertBoxLevel.Error, reason.message);
      });
  };

  const handleButtonClear = () => {
    // Handle user clicking Clear button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataClearCards(newRoundData);
    setRoundData(newRoundData);
    hideAlertBox();
  };

  const handleButtonRandom = () => {
    // Handle user clicking Random button
    let newRoundData: IRoundData = roundDataCopy(roundData);
    roundDataRandomizeCards(newRoundData);
    setRoundData(newRoundData);
    hideAlertBox();
  };

  return (
    <div className="button-bar">
      <button className="btn btn-primary" onClick={handleSubmitRoundResult}>
        Submit
      </button>
      <button className="btn btn-secondary" onClick={handleButtonClear}>
        Clear
      </button>
      <button className="btn btn-secondary" onClick={handleButtonRandom}>
        Random
      </button>
    </div>
  );
};

export default HandEntryButtonBar;
