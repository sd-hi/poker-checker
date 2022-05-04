import { Card, PokerWinner } from "@poker-checker/common";
import { boolean, string } from "joi";
import { Schema, model } from "mongoose";
import RoundResult from "../../resources/roundresult/roundresult.interface";

const CardSchema = new Schema(
  {
    suit: String,
    rank: String,
  },
  { _id: false }
);

const RoundResultInputSchema = new Schema({
  river: {
    cards: { type: [CardSchema], required: true },
  },
  playerA: {
    name: { type: String, required: true },
    cards: { type: [CardSchema], required: true },
  },
  playerB: {
    name: { type: String, required: true },
    cards: { type: [CardSchema], required: true },
  },
});

const RoundResultSchema = new Schema(
  {
    input: { type: [RoundResultInputSchema] },
    outcome: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default model<RoundResult>("RoundResult", RoundResultSchema);
