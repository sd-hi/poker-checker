import { ICard } from "./classes";
import { Rank, Suit } from "./const";
import { CardShoe } from "./dealing";

describe("CardShoe suite", () => {
  test("construction", () => {
    let shoe: CardShoe = new CardShoe();

    // Expect shoe to initially have cards
    expect(shoe.getCount()).toBe(52);
  });

  test("single deck unshuffled", () => {
    let shoe: CardShoe = new CardShoe();
    let card: ICard | null;
    let cards: ICard[] = [];

    // Start with empty shoe
    shoe.empty();
    expect(shoe.getCount()).toBe(0);

    // Add ordered deck
    shoe.addDeck(false);
    expect(shoe.getCount()).toBe(52);

    // Empty deck to array
    for (let i = 1; i <= 53; i++) {
      card = shoe.dealCard();

      if (i <= 52) {
        expect(card).toBeInstanceOf(Object);
        expect(card.rank).not.toBe(Rank.None);
        expect(card.suit).not.toBe(Suit.None);

        cards.push(card);
      } else {
        expect(card).toBeNull();
      }
    }

    // Check order of array
    expect(cards[0].suit).toBe(Suit.Club);
    expect(cards[0].rank).toBe(Rank.Ace);
    expect(cards[1].suit).toBe(Suit.Club);
    expect(cards[1].rank).toBe(Rank.Two);
    expect(cards[2].suit).toBe(Suit.Club);
    expect(cards[2].rank).toBe(Rank.Three);
  });

  test("single deck shuffled", () => {
    let shoe: CardShoe = new CardShoe();
    let cards: ICard[] = [];
    let isOrdered: boolean;
    let checkConditions: (() => {})[] = [];

    // Start with empty shoe
    shoe.empty();
    expect(shoe.getCount()).toBe(0);

    // Add shuffled deck
    shoe.addDeck(true);
    expect(shoe.getCount()).toBe(52);

    // Deal some of the cards
    for (let i = 1; i <= 7; i++) {
      cards.push(shoe.dealCard());
    }

    // Check order of cards being dealt
    isOrdered = true;

    // If another suit crept in, shuffle was successful
    cards.forEach((card) => {
      if (card.suit !== Suit.Club) {
        isOrdered = false;
      }
    });

    // If ordering of ranks is different, shuffle was successful
    checkConditions.push(() => cards[0].rank === Rank.Ace);
    checkConditions.push(() => cards[1].rank === Rank.Two);
    checkConditions.push(() => cards[2].rank === Rank.Three);
    checkConditions.push(() => cards[3].rank === Rank.Four);
    checkConditions.push(() => cards[4].rank === Rank.Five);
    checkConditions.push(() => cards[5].rank === Rank.Six);
    checkConditions.push(() => cards[6].rank === Rank.Seven);
    checkConditions.forEach((condition) => {
      if (condition() === false) {
        isOrdered = false;
      }
    });

    // Verify some shuffling occurred
    expect(isOrdered).toBe(false);
  });
});
