import { ICard } from "./classes";
import { Language, Suit, Rank, PokerHandResult, PokerWinner } from "./const";
import { describeCard } from "./language";

describe("describeCard suite", () => {
  testDescribeCard(Suit.Club, Rank.Ace, "Ace of Clubs");
  testDescribeCard(Suit.Diamond, Rank.Two, "Two of Diamonds");
  testDescribeCard(Suit.Heart, Rank.Three, "Three of Hearts");
  testDescribeCard(Suit.Spade, Rank.Four, "Four of Spades");

  function testDescribeCard(
    suit: Suit,
    rank: Rank,
    expectedDescription: string
  ) {
    test(expectedDescription, () => {
      expect(
        describeCard(Language.English, { suit: suit, rank: rank })
      ).toEqual(expectedDescription);
    });
  }
});
