import { Card } from "@poker-checker/common";
import { string } from "joi";
import { Schema, model } from "mongoose";
import RoundResult from "../../resources/roundresult/roundresult.interface";

const CardSchema = new Schema(
  {
    suit: String,
    rank: String,
  },
  { _id: false }
);

const RoundResultSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default model<RoundResult>("RoundResult", RoundResultSchema);
