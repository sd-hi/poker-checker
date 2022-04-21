// Constants

export enum Language {
  English = "en",
}

export enum Suit {
  Club = "C",
  Diamond = "D",
  Heart = "H",
  Spade = "S",
  None = "0",
}

export const SuitDescription = new Map<Suit, string>([
  [Suit.Club, "Club"],
  [Suit.Diamond, "Diamond"],
  [Suit.Heart, "Heart"],
  [Suit.Spade, "Spade"],
  [Suit.None, "None"],
]);

export enum Rank {
  None = "0",
  Ace = "A",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "J",
  Queen = "Q",
  King = "K",
}

export const RankDescription = new Map<Rank, string>([
  [Rank.None, "None"],
  [Rank.Ace, "Ace"],
  [Rank.Two, "Two"],
  [Rank.Three, "Three"],
  [Rank.Four, "Four"],
  [Rank.Five, "Five"],
  [Rank.Six, "Six"],
  [Rank.Seven, "Seven"],
  [Rank.Eight, "Eight"],
  [Rank.Nine, "Nine"],
  [Rank.Ten, "Ten"],
  [Rank.Jack, "Jack"],
  [Rank.Queen, "Queen"],
  [Rank.King, "King"],
]);

export enum PokerHandResult {
  RoyalFlush = 10,
  StraightFlush = 9,
  FourOfAKind = 8,
  FullHouse = 7,
  Flush = 6,
  Straight = 5,
  ThreeOfAKind = 4,
  TwoPair = 3,
  Pair = 2,
  HighCard = 1,
  None = 0,
}

export const PokerHandResultDescription = new Map<PokerHandResult, string>([
  [PokerHandResult.Flush, "Flush"],
  [PokerHandResult.FourOfAKind, "Four of a Kind"],
  [PokerHandResult.FullHouse, "Full House"],
  [PokerHandResult.HighCard, "High Card"],
  [PokerHandResult.None, "None"],
  [PokerHandResult.Pair, "Pair"],
  [PokerHandResult.RoyalFlush, "Royal Flush"],
  [PokerHandResult.Straight, "Straight"],
  [PokerHandResult.StraightFlush, "Straight Flush"],
  [PokerHandResult.ThreeOfAKind, "Three of a Kind"],
  [PokerHandResult.TwoPair, "Two Pair"],
]);

export enum PokerWinner {
  HandA = 1,
  HandB = -1,
  Tie = 0,
}
