import Joi from "joi";
import { join } from "path";
import { Suit, Rank } from "@poker-checker/common";

const validSuitValues: Array<String> = Object.values(Suit).filter((suit) => suit != Suit.None);
const validRankValues: Array<String> = Object.values(Rank).filter((rank) => rank != Rank.None);

const joiCardSchema = Joi.object().keys({
  suit: Joi.string().required().valid(...validSuitValues),
  rank: Joi.string().required().valid(...validRankValues),
});

const joiRiverSchema = Joi.object().keys({
  cards: Joi.array().required().items(joiCardSchema).length(5),
});

const joiPlayerSchema = Joi.object().keys({
  name: Joi.string().required(),
  cards: Joi.array().required().items(joiCardSchema).length(2),
});

const create = Joi.object({
  river: joiRiverSchema.required(),
  playerA: joiPlayerSchema.required(),
  playerB: joiPlayerSchema.required(),
});

export default { create };
