import { Suit, Rank } from "./const";

export class Card {
  private suit: Suit;
  private rank: Rank;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getRank(): Rank {
    return this.rank;
  }

  getSuit(): Suit {
    return this.suit;
  }

  toInterface(): ICard {
    return {
      suit: this.suit,
      rank: this.rank,
    };
  }
}

export interface ICard {
  suit: Suit;
  rank: Rank;
}
