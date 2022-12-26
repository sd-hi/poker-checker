import { ICard } from "./classes";
import { Rank, Suit } from "./const";

// Functions related to dealing cards

// Shoe class to deal cards from
export class CardShoe {
  cards: ICard[] = []; // Cards in the shoe

  constructor() {
    // Constructor for new shoe

    // Add a deck by default
    this.addDeck();
  }

  addDeck(shuffle: Boolean = true) {
    // Add an ordered deck to the shoe
    const addSuits: Suit[] = [Suit.Club, Suit.Diamond, Suit.Heart, Suit.Spade];
    let addCards: ICard[] = [];

    // Prepare a sorted array of cards (a deck of cards)
    addSuits.forEach((suit) => {
      Object.values(Rank).forEach((rank) => {
        if (rank === Rank.None) {
          return;
        }

        addCards.push({ suit: suit, rank: rank });
      });
    });

    if (shuffle) {
      // Shuffle the cards before adding to shoe
      addCards = addCards
        .map((card) => ({ card: card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ card }) => card);
    }

    // Add the cards to the shoe
    this.cards = this.cards.concat(addCards);
  }

  dealCard(): ICard | null {
    // Deal a card out of the shoe
    let card: ICard;

    if (this.cards.length === 0) {
      // Nothing to deal
      return null;
    }

    // Return the dealt card, removing it from the shoe in the process
    return this.cards.shift();
  }

  empty() {
    // Empty the shoe
    this.cards = [];
  }

  getCount(): number {
    // Get the count of cards in the shoe
    return this.cards.length;
  }
}
