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
        src={cardImageFilePath(card)}
        alt={describeCard(Language.English, card)}
        title={describeCard(Language.English, card)}
      ></img>
    );
  } else {
    return <div></div>;
  }

  function cardImageFilePath(card: Card): string {
    // Get path to image for given card
    let filePath: string = "";

    filePath += `/public/images/cards/`;
    filePath += SuitDescription.get(card.getSuit());
    filePath += `s`;
    filePath += `_`;

    switch (card.getRank()) {
      case Rank.Ace:
      case Rank.Jack:
      case Rank.Queen:
      case Rank.King:
        // Use word
        filePath += RankDescription.get(card.getRank());
        break;
      default:
        // Use number
        filePath += card.getRank();
    }

    filePath += `.svg`;

    filePath = filePath.toLowerCase();

    return filePath;
  }
};

export default CardImage;
