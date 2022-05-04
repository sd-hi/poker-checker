import { Card, Rank, Suit } from "@poker-checker/common";
import React, { useEffect } from "react";
import CardImage from "../shared/cardimage";
import { IRoundData, ISlotKey, roundDataGetCard } from "../shared/rounddata";

type CardSlotProps = {
  roundData: IRoundData;
  slotKey: ISlotKey;
  openChooser: (slotKey: ISlotKey) => void;
};

const CardSlot = ({ roundData, slotKey, openChooser }: CardSlotProps) => {
  const card: Card = roundDataGetCard(roundData, slotKey);

  useEffect(() => {
    // Card slots depend on round data
  }, [roundData]);

  if (card.getSuit() !== Suit.None && card.getRank() !== Rank.None) {
    return (
      <CardImage
        onClick={() => {
          openChooser(slotKey);
        }}
        card={card}
      />
    );
  } else {
    return (
      <div
        className="card-slot"
        onClick={() => {
          openChooser(slotKey);
        }}
      ></div>
    );
  }
};

export default CardSlot;
