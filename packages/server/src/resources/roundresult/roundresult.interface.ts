import { Document } from "mongoose";
import { Card, PokerRoundState } from "@poker-checker/common";

export interface RoundResultRequestPayload {
  river: {
    cards: Array<Card>;
  };
  playerA: {
    name: string;
    cards: Array<Card>;
  };
  playerB: {
    name: string;
    cards: Array<Card>;
  };
}

export interface RoundResultResponsePayload {
  input: RoundResultRequestPayload; // Return the input in the response
  outcome: PokerRoundState; // Outcome of the poker round submitted
}

export interface RoundResult extends Document, RoundResultResponsePayload {}

export default RoundResult;
