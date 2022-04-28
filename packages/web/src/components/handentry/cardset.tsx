import React from "react";
import CardSlot from "./cardslot";
import { ICardSlotData, IHandData, IRoundData, ISlotKey } from "./rounddata";

type CardSetProps = {
  roundData: IRoundData;
  handId: string;
  openChooser: (slotKey: ISlotKey) => void;
};

const CardSet = ({ roundData, handId, openChooser }: CardSetProps) => {
  const hands: Array<IHandData> = roundData.hands;
  const hand = hands.find((hand: IHandData) => hand.id === handId);
  if (!hand) {
    return <></>;
  }

  return (
    <div className="card-set-container">
      <div className="card-set-title">
        <h2>{hand.name}</h2>
      </div>
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
