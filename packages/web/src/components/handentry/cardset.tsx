import React from "react";
import CardSlot from "./cardslot";
import { ICardSlotData, IHandData, useHandEntryContext } from "./context";

type CardSetProps = {
  handId: string;
}

const CardSet = ({ handId }: CardSetProps) => {
  const handEntryContext = useHandEntryContext();

  if (handEntryContext === null) {
    return <></>;
  }

  const hands: Array<IHandData> = handEntryContext.roundData.hands;
  const hand = hands.find((hand: IHandData) => hand.id === handId);
  if (!hand) {
    return <></>;
  }

  const describeHand = (handId: string) => {
    switch (handId) {
      case "river":
        return "River";
      case "hand1":
        return "Player 1";
      case "hand2":
        return "Player 2";
      default:
        return "Undefined";
    }
  };

  return (
    <div className="card-set-container">
      <div className="card-set-title">
        <h2>{describeHand(hand.name)}</h2>
      </div>
      <div className="card-set-slots">
        {hand.slots.map((slot: ICardSlotData) => {
          return <CardSlot key={slot.id} slotId={slot.id} handId={handId} />;
        })}
      </div>
    </div>
  );
};

export default CardSet;
