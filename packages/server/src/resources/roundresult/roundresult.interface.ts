import { Document, Types } from "mongoose";
import { Card, Rank, Suit, PokerRoundState } from "@poker-checker/common";

interface RoundResultPayloadCard {
  suit: Suit;
  rank: Rank;
}

export interface RoundResultPostRequestPayload {
  river: {
    cards: Array<RoundResultPayloadCard>;
  };
  playerA: {
    name: string;
    cards: Array<RoundResultPayloadCard>;
  };
  playerB: {
    name: string;
    cards: Array<RoundResultPayloadCard>;
  };
}

export interface RoundResultEntry {
  input: RoundResultPostRequestPayload; // Return the input in the response
  outcome: PokerRoundState; // Outcome of the poker round submitted
}

export interface RoundResultPostResponsePayload {
  id: string; // ID for round result created in database
}

export interface RoundResultGetResponsePayload extends RoundResultEntry {}

export interface RoundResult extends Document, RoundResultGetResponsePayload {}

export default RoundResult;
