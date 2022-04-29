import React from "react";
import { IHandData, IRoundData } from "./rounddata";

interface ICardSetTitleProps {
  roundData: IRoundData;
  handId: string;
  setRoundData: (roundData: IRoundData) => void;
  openPlayerEditor: (handId: string) => void;
}

const CardSetTitle = ({
  roundData,
  handId,
  setRoundData,
  openPlayerEditor,
}: ICardSetTitleProps) => {
  const hand = roundData.hands.find((hand: IHandData) => hand.id === handId);
  if (!hand) {
    return <></>;
  }

  const handleClick = () => {
    // User has clicked on hand title
    openPlayerEditor(handId);
  };

  return (
    <div className="card-set-title" onClick={handleClick}>
      <h2>{hand.name}</h2>
    </div>
  );
};

export default CardSetTitle;
