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

export function describeCard(language: Language, card: ICard | null): string {
  // Describe given card as human friendly description
  let description: string = "";

  if (card === null) {
    return "NULL CARD";
  }

  description += RankDescription.get(card.rank);
  description += " of ";
  description += SuitDescription.get(card.suit);
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
        " of " + SuitDescription.get(state.finalResultCards[0].suit) + "s";
    case PokerHandResult.Straight:
      // Results best described by their highest card
      description +=
        " with high card of " + RankDescription.get(state.finalResultRanks[0]);
      break;
    case PokerHandResult.HighCard:
      // Result desribed by highest card
      description += " of " + RankDescription.get(state.finalResultRanks[0]);
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
        description += RankDescription.get(state.finalResultRanks[i]) + "s";
      }
      break;
    case PokerHandResult.RoyalFlush:
      // Results described by their suit
      description +=
        " of " + SuitDescription.get(state.finalResultCards[0].suit) + "s";
  }

  return description;
}
