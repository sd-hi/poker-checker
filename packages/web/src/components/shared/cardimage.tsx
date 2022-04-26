import React from "react";
import {
  Language,
  Suit,
  SuitDescription,
  Rank,
  RankDescription,
  describeCard,
  Card,
} from "@poker-checker/common";

const CardImage = ({
  card,
  onClick,
}: {
  card: Card;
  onClick: React.MouseEventHandler<HTMLImageElement> | undefined;
}) => {
  // Get card for this slot

  if (card.getSuit() !== Suit.None && card.getRank() !== Rank.None) {
    return (
      <img
        className="card-image"
        onClick={onClick}
        src={`/images/cards/${SuitDescription.get(
          card.getSuit()
        )}s_${RankDescription.get(card.getRank())}.svg`}
        alt={describeCard(Language.English, card)}
        title={describeCard(Language.English, card)}
      ></img>
    );
  } else {
    return <div></div>;
  }
};

export default CardImage;
