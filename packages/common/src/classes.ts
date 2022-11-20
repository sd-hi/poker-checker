import { Suit, Rank } from "./const";

export function cardObject(suit: Suit, rank: Rank): ICard {
  // Take suit and rank and return card interface
  return { suit: suit, rank: rank };
}

export interface ICard {
  // Interface describing a card
  suit: Suit;
  rank: Rank;
}
