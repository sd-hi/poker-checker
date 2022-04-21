import React from "react";
import CardSlot from "./cardslot";
import { useHandEntryContext } from "./context";

const CardSet = ({ handId }) => {
  const { hands } = useHandEntryContext();

  const hand = hands.find((hand) => hand.id === handId);

  const describeHand = (handId) => {
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
        <h2>{describeHand(hand.id)}</h2>
      </div>
      <div className="card-set-slots">
        {hand.slots.map((slot) => {
          return <CardSlot key={slot.id} slotId={slot.id} handId={handId} />;
        })}
      </div>
    </div>
  );
};

export default CardSet;
