import React from "react";
import {
  Language,
  Suit,
  Rank,
  describeCard,
  ICard,
  rankValue,
} from "@poker-checker/common";

import back from "../../images/cards/back.svg";

import clubs_ace from "../../images/cards/clubs_ace.svg";
import clubs_2 from "../../images/cards/clubs_2.svg";
import clubs_3 from "../../images/cards/clubs_3.svg";
import clubs_4 from "../../images/cards/clubs_4.svg";
import clubs_5 from "../../images/cards/clubs_5.svg";
import clubs_6 from "../../images/cards/clubs_6.svg";
import clubs_7 from "../../images/cards/clubs_7.svg";
import clubs_8 from "../../images/cards/clubs_8.svg";
import clubs_9 from "../../images/cards/clubs_9.svg";
import clubs_10 from "../../images/cards/clubs_10.svg";
import clubs_jack from "../../images/cards/clubs_jack.svg";
import clubs_queen from "../../images/cards/clubs_queen.svg";
import clubs_king from "../../images/cards/clubs_king.svg";

import diamonds_ace from "../../images/cards/diamonds_ace.svg";
import diamonds_2 from "../../images/cards/diamonds_2.svg";
import diamonds_3 from "../../images/cards/diamonds_3.svg";
import diamonds_4 from "../../images/cards/diamonds_4.svg";
import diamonds_5 from "../../images/cards/diamonds_5.svg";
import diamonds_6 from "../../images/cards/diamonds_6.svg";
import diamonds_7 from "../../images/cards/diamonds_7.svg";
import diamonds_8 from "../../images/cards/diamonds_8.svg";
import diamonds_9 from "../../images/cards/diamonds_9.svg";
import diamonds_10 from "../../images/cards/diamonds_10.svg";
import diamonds_jack from "../../images/cards/diamonds_jack.svg";
import diamonds_queen from "../../images/cards/diamonds_queen.svg";
import diamonds_king from "../../images/cards/diamonds_king.svg";

import hearts_ace from "../../images/cards/hearts_ace.svg";
import hearts_2 from "../../images/cards/hearts_2.svg";
import hearts_3 from "../../images/cards/hearts_3.svg";
import hearts_4 from "../../images/cards/hearts_4.svg";
import hearts_5 from "../../images/cards/hearts_5.svg";
import hearts_6 from "../../images/cards/hearts_6.svg";
import hearts_7 from "../../images/cards/hearts_7.svg";
import hearts_8 from "../../images/cards/hearts_8.svg";
import hearts_9 from "../../images/cards/hearts_9.svg";
import hearts_10 from "../../images/cards/hearts_10.svg";
import hearts_jack from "../../images/cards/hearts_jack.svg";
import hearts_queen from "../../images/cards/hearts_queen.svg";
import hearts_king from "../../images/cards/hearts_king.svg";

import spades_ace from "../../images/cards/spades_ace.svg";
import spades_2 from "../../images/cards/spades_2.svg";
import spades_3 from "../../images/cards/spades_3.svg";
import spades_4 from "../../images/cards/spades_4.svg";
import spades_5 from "../../images/cards/spades_5.svg";
import spades_6 from "../../images/cards/spades_6.svg";
import spades_7 from "../../images/cards/spades_7.svg";
import spades_8 from "../../images/cards/spades_8.svg";
import spades_9 from "../../images/cards/spades_9.svg";
import spades_10 from "../../images/cards/spades_10.svg";
import spades_jack from "../../images/cards/spades_jack.svg";
import spades_queen from "../../images/cards/spades_queen.svg";
import spades_king from "../../images/cards/spades_king.svg";

const cardPaths = {
  clubs: [
    clubs_ace,
    clubs_2,
    clubs_3,
    clubs_4,
    clubs_5,
    clubs_6,
    clubs_7,
    clubs_8,
    clubs_9,
    clubs_10,
    clubs_jack,
    clubs_queen,
    clubs_king,
  ],
  diamonds: [
    diamonds_ace,
    diamonds_2,
    diamonds_3,
    diamonds_4,
    diamonds_5,
    diamonds_6,
    diamonds_7,
    diamonds_8,
    diamonds_9,
    diamonds_10,
    diamonds_jack,
    diamonds_queen,
    diamonds_king,
  ],
  hearts: [
    hearts_ace,
    hearts_2,
    hearts_3,
    hearts_4,
    hearts_5,
    hearts_6,
    hearts_7,
    hearts_8,
    hearts_9,
    hearts_10,
    hearts_jack,
    hearts_queen,
    hearts_king,
  ],
  spades: [
    spades_ace,
    spades_2,
    spades_3,
    spades_4,
    spades_5,
    spades_6,
    spades_7,
    spades_8,
    spades_9,
    spades_10,
    spades_jack,
    spades_queen,
    spades_king,
  ],
};

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
        src={getCardPath(card)}
        alt={describeCard(Language.English, card)}
        title={describeCard(Language.English, card)}
      ></img>
    );
  } else {
    return <div></div>;
  }

  function getCardPath(card: ICard) {
    // Get path to image for given card

    switch (card.suit) {
      case Suit.Club:
        return cardPaths.clubs[rankValue(card.rank, false) - 1];
      case Suit.Diamond:
        return cardPaths.diamonds[rankValue(card.rank, false) - 1];
      case Suit.Heart:
        return cardPaths.hearts[rankValue(card.rank, false) - 1];
      case Suit.Spade:
        return cardPaths.spades[rankValue(card.rank, false) - 1];
      default:
        return back;
    }
  }
};

export default CardImage;
