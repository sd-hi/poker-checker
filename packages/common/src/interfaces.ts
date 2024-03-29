import { ICard } from "./classes";
import { PokerHandResult, Rank, PokerWinner } from "./const";

export interface PokerHandState {
  duplicateResult: PokerHandResult; // Outcome of check for duplicate cards
  duplicateResultCards: Array<ICard>; // Cards that contributed to the positive duplicate result
  duplicateKickerCards: Array<ICard>; // Cards that serve as kickers to the duplicate result

  flushResult: PokerHandResult; // Outcome of check for flush
  flushResultCards: Array<ICard>; // Cards that contributed to the positive flush result

  straightResult: PokerHandResult; // Outcome of check for straight
  straightResultCards: Array<ICard>; // Cards that contributed to the positive straight result

  finalResult: PokerHandResult; // Final outcome of analysis for set of cards
  finalResultCards: Array<ICard>; // Cards that contributed to the final result
  finalResultRanks: Array<Rank>; // Ranks that determine value of hand
  finalResultTieBreakCards: Array<ICard>; // Cards to be used in tie-breaker situation
}

export function initializePokerHandState() {
  return {
    duplicateResult: PokerHandResult.None,
    duplicateResultCards: [],
    duplicateKickerCards: [],

    flushResult: PokerHandResult.None,
    flushResultCards: [],

    straightResult: PokerHandResult.None,
    straightResultCards: [],

    finalResult: PokerHandResult.None,
    finalResultCards: [],
    finalResultRanks: [],
    finalResultTieBreakCards: [],
  };
}

export interface PokerRoundState {
  winner: PokerWinner; // The determined winner

  handStateA: PokerHandState; // The state of player A's hand
  handStateB: PokerHandState; // The state of player B's hand

  tieBreakerUsed: boolean; // Whether the tie breaker cards were used in the result
  tieBreakerWinCard: ICard | null; // The tie breaking card that ultimately won
  tieBreakerLossCard: ICard | null; // The tie breaking card that ultimately lost
}

export function initializePokerRoundState() {
  return {
    winner: PokerWinner.Tie,
    handStateA: initializePokerHandState(),
    handStateB: initializePokerHandState(),

    tieBreakerUsed: false,
    tieBreakerWinCard: null,
    tieBreakerLossCard: null,
  };
}
