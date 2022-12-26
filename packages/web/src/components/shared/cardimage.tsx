import React from "react";
import {
  Language,
  Suit,
  SuitDescription,
  Rank,
  RankDescription,
  describeCard,
  ICard,
} from "@poker-checker/common";

type CardImageProps = {
  card: ICard;
  onClick?: React.MouseEventHandler<HTMLImageElement> | undefined;
};

const CardImage = ({ card, onClick }: CardImageProps) => {
  // Get card for this slot

  if (card.suit !== Suit.None && card.rank !== Rank.None) {
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

  function cardImageFilePath(card: ICard): string {
    // Get path to image for given card
    let filePath: string = "";

    filePath += `/images/cards/`;
    filePath += SuitDescription.get(card.suit);
    filePath += `s`;
    filePath += `_`;

    switch (card.rank) {
      case Rank.Ace:
      case Rank.Jack:
      case Rank.Queen:
      case Rank.King:
        // Use word
        filePath += RankDescription.get(card.rank);
        break;
      default:
        // Use number
        filePath += card.rank;
    }

    filePath += `.svg`;

    filePath = filePath.toLowerCase();

    return filePath;
  }
};

export default CardImage;
