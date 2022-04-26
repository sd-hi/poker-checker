import { Rank, Suit } from "@poker-checker/common";
import React from "react";
import CardImage from "../shared/cardimage";
import {
  ICardSlotData,
  IHandData,
  IRoundData,
  useRoundDataContext,
} from "./rounddataContext";

type CardSlotProps = {
  handId: string;
  slotId: number;
};

const CardSlot = ({ handId, slotId }: CardSlotProps) => {
  const roundDataContext = useRoundDataContext();
  if (!roundDataContext) {
    return <></>;
  }

  const roundData: IRoundData = roundDataContext.roundData;
  const openChooser = roundDataContext.openChooser;

  const hand = roundData.hands.find((hands: IHandData) => hands.id === handId);
  if (!hand) {
    return <></>;
  }

  const slot = hand.slots.find((slot: ICardSlotData) => slot.id === slotId);
  if (!slot) {
    return <></>;
  }

  if (slot.card.getSuit() !== Suit.None && slot.card.getRank() !== Rank.None) {
    return (
      <CardImage onClick={() => openChooser(handId, slotId)} card={slot.card} />
    );
  } else {
    return (
      <div
        className="card-slot"
        onClick={() => openChooser(handId, slotId)}
      ></div>
    );
  }
};

export default CardSlot;
