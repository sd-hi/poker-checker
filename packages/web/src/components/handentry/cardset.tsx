import React from "react";
import CardSlot from "./cardslot";
import CardSetTitle from "./cardsettitle";
import { ICardSlotData, IHandData, IRoundData, ISlotKey } from "../shared/rounddata";

type ICardSetProps = {
  roundData: IRoundData;
  handId: string;
  openChooser: (slotKey: ISlotKey) => void;
  openPlayerEditor: (handId: string) => void;
  setRoundData: (roundData: IRoundData) => void;
};

const CardSet = ({
  roundData,
  handId,
  openChooser,
  openPlayerEditor,
  setRoundData,
}: ICardSetProps) => {
  const hands: Array<IHandData> = roundData.hands;
  const hand = hands.find((hand: IHandData) => hand.id === handId);
  if (!hand) {
    return <></>;
  }

  return (
    <div className="card-set-container">
      <CardSetTitle
        handId={handId}
        roundData={roundData}
        setRoundData={setRoundData}
        openPlayerEditor={openPlayerEditor}
      />
      <div className="card-set-slots">
        {hand.slots.map((slot: ICardSlotData) => {
          return (
            <CardSlot
              key={slot.id}
              openChooser={openChooser}
              roundData={roundData}
              slotKey={{ handId: handId, slotId: slot.id }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardSet;
