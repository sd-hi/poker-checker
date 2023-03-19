import { Document } from "mongoose";
import { Rank, Suit, PokerRoundState } from "@poker-checker/common";
import { RoundResultEntry } from "../roundresult/roundresult.interface";

export interface RoundHistoryGetResponsePayload {
  roundResults: Array<RoundResultEntry>;
}
