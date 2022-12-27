import { ICard } from "./classes";
import {
  Language,
  PokerHandResult,
  PokerHandResultDescription,
  Rank,
  RankDescription,
  Suit,
  SuitDescription,
} from "./const";
import { PokerHandState, PokerRoundState } from "./interfaces";

export function describeRank(
  // Describe a given rank as human friendly description
  language: Language,
  rank: Rank | null,
  pluralize: boolean = false
): string {
  let description: string = "";
  let pluralSuffix: string = "";

  if (!rank) {
    return "NULL RANK";
  }

  description = RankDescription.get(rank);

  // Pluralize the rank description by adding appropriate suffix
  if (pluralize) {
    switch (rank) {
      case Rank.Six:
        pluralSuffix = "es";
        break;
      default:
        pluralSuffix = "s";
    }
    description += pluralSuffix;
  }

  return description;
}

export function describeSuit(
  // Describe a given suit as human friendly description
  language: Language,
  suit: Suit | null,
  pluralize: boolean = false
): string {
  let description: string = "";
  let pluralSuffix: string = "";

  if (!suit) {
    return "NULL SUIT";
  }

  description = SuitDescription.get(suit);

  // Pluralize the suit description by adding appropriate suffix
  if (pluralize) {
    description += "s";
  }

  return description;
}

export function describeCard(language: Language, card: ICard | null): string {
  // Describe given card as human friendly description
  let description: string = "";

  if (!card) {
    return "NULL CARD";
  }

  description += describeRank(language, card.rank);
  description += " of ";
  description += describeSuit(language, card.suit);
  description += "s";

  return description;
}

export function describePokerRoundResult(
  language: Language,
  state: PokerRoundState
): string {
  // Describe the result of a given poker round
  let description: string = "";

  // Comment on the tie breaker
  if (state.tieBreakerUsed) {
    description += "Tie was broken by ";
    description += describeCard(language, state.tieBreakerWinCard);
    description += " which beat ";
    description += describeCard(language, state.tieBreakerLossCard);
  }

  return description;
}

export function describePokerHandState(
  language: Language,
  state: PokerHandState
): string {
  // Describe the given poker hand result, assumes results have already been detected
  let description: string = "";

  // Describe result of hand
  description += PokerHandResultDescription.get(state.finalResult);

  switch (state.finalResult) {
    case PokerHandResult.Flush:
    case PokerHandResult.StraightFlush:
      description +=
        " of " +
        describeSuit(Language.English, state.finalResultCards[0].suit, true);
    case PokerHandResult.Straight:
      // Results best described by their highest card
      description +=
        " with high card of " +
        describeRank(Language.English, state.finalResultRanks[0]);
      break;
    case PokerHandResult.HighCard:
      // Result desribed by highest card
      description +=
        " of " + describeRank(Language.English, state.finalResultRanks[0]);
      break;
    case PokerHandResult.FourOfAKind:
    case PokerHandResult.FullHouse:
    case PokerHandResult.Pair:
    case PokerHandResult.ThreeOfAKind:
    case PokerHandResult.TwoPair:
      // Results described by their duplicates
      for (let i = 0; i < state.finalResultRanks.length; i++) {
        if (i === 0) {
          description += " of ";
        } else {
          description += " and ";
        }
        description += describeRank(
          Language.English,
          state.finalResultRanks[i],
          true
        );
      }
      break;
    case PokerHandResult.RoyalFlush:
      // Results described by their suit
      description +=
        " of " +
        describeSuit(Language.English, state.finalResultCards[0].suit, true);
  }

  return description;
}
