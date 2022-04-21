import React from "react";
import CardImage from "../shared/cardimage";
import { useHandEntryContext } from "./context";

const CardSlot = ({ handId: string, slotId: number }) => {
  const { hands, openChooser }: {hands: HandsData, } = useHandEntryContext();

  const hand = hands.find((hands) => hands.id === handId);
  const slot = hand.slots.find((slot) => slot.id === slotId);
  const { suit, rank } = slot;

  if (suit && rank) {
    return <CardImage onClick={() => openChooser(handId, slotId)} suit={suit} rank={rank} />;
  } else {
    return (
      <div className="card-slot" onClick={() => openChooser(handId, slotId)}>
      </div>
    );
  }
};

export default CardSlot;
