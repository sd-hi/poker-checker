import { Document } from "mongoose";
import { Card, Rank, Suit, PokerRoundState } from "@poker-checker/common";

interface RoundResultRequestPayloadCard {
  suit: Suit;
  rank: Rank;
}

export interface RoundResultRequestPayload {
  river: {
    cards: Array<RoundResultRequestPayloadCard>;
  };
  playerA: {
    name: string;
    cards: Array<RoundResultRequestPayloadCard>;
  };
  playerB: {
    name: string;
    cards: Array<RoundResultRequestPayloadCard>;
  };
}

export interface RoundResultResponsePayload {
  input: RoundResultRequestPayload; // Return the input in the response
  outcome: PokerRoundState; // Outcome of the poker round submitted
}

export interface RoundResult extends Document, RoundResultResponsePayload {}

export default RoundResult;
