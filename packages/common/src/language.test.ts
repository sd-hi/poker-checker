import { ICard } from "./classes";
import { Language, Suit, Rank, PokerHandResult, PokerWinner } from "./const";
import { describeCard, describeRank, describeSuit } from "./language";

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

describe("describeRank suite", () => {
  
  // Test singular
  expect(describeRank(Language.English, Rank.Ace)).toBe("Ace");
  expect(describeRank(Language.English, Rank.Two)).toBe("Two");
  expect(describeRank(Language.English, Rank.Three)).toBe("Three");
  expect(describeRank(Language.English, Rank.Six)).toBe("Six");
  expect(describeRank(Language.English, Rank.Ten)).toBe("Ten");
  expect(describeRank(Language.English, Rank.Jack)).toBe("Jack");
  expect(describeRank(Language.English, Rank.Queen)).toBe("Queen");
  expect(describeRank(Language.English, Rank.King)).toBe("King");

  // Test plural
  expect(describeRank(Language.English, Rank.Ace, true)).toBe("Aces");
  expect(describeRank(Language.English, Rank.Two, true)).toBe("Twos");
  expect(describeRank(Language.English, Rank.Three, true)).toBe("Threes");
  expect(describeRank(Language.English, Rank.Six, true)).toBe("Sixes");
  expect(describeRank(Language.English, Rank.Ten, true)).toBe("Tens");
  expect(describeRank(Language.English, Rank.Jack, true)).toBe("Jacks");
  expect(describeRank(Language.English, Rank.Queen, true)).toBe("Queens");
  expect(describeRank(Language.English, Rank.King, true)).toBe("Kings");
});

describe("describeSuit suite", () => {

  // Test singular
  expect(describeSuit(Language.English, Suit.Club)).toBe("Club");
  expect(describeSuit(Language.English, Suit.Diamond)).toBe("Diamond");
  expect(describeSuit(Language.English, Suit.Heart)).toBe("Heart");
  expect(describeSuit(Language.English, Suit.Spade)).toBe("Spade");

  // Test plural
  expect(describeSuit(Language.English, Suit.Club, true)).toBe("Clubs");
  expect(describeSuit(Language.English, Suit.Diamond, true)).toBe("Diamonds");
  expect(describeSuit(Language.English, Suit.Heart, true)).toBe("Hearts");
  expect(describeSuit(Language.English, Suit.Spade, true)).toBe("Spades");
});
