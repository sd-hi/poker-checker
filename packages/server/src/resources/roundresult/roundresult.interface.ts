import { Document } from "mongoose";
import { Card } from "@poker-checker/common";

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

interface RoundResult extends Document, RoundResultRequestPayload {}

export default RoundResult;
