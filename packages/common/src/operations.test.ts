import { Language, Suit, Rank, PokerHandResult, PokerWinner } from "./const";
import { cardObject, ICard } from "./classes";
import {
  initializePokerHandState,
  initializePokerRoundState,
  PokerHandState,
  PokerRoundState,
} from "./interfaces";
import { describePokerHandState, describePokerRoundResult } from "./language";
import {
  detectPokerHandResult,
  detectPokerHandResult_Detect_Duplicates,
  detectPokerHandResult_Detect_Flush,
  detectPokerHandResult_Detect_Straight,
  getHighestRank,
  getMostFrequentRank,
  getMostFrequentSuit,
  detectPokerHandResult_DetermineResultValue_Duplicates,
  rankDifference,
  rankValue,
  removeDuplicateRankCards,
  identifyPokerWinner,
} from "./operations";

describe("rankValue suite", () => {
  testRankValue(Rank.Ace, 1);
  testRankValue(Rank.Ace, 1, false);
  testRankValue(Rank.Ace, 14, true);

  testRankValue(Rank.Two, 2);
  testRankValue(Rank.Three, 3);
  testRankValue(Rank.Four, 4);
  testRankValue(Rank.Five, 5);
  testRankValue(Rank.Six, 6);
  testRankValue(Rank.Seven, 7);
  testRankValue(Rank.Eight, 8);
  testRankValue(Rank.Nine, 9);
  testRankValue(Rank.Ten, 10);

  // Test picture cards
  testRankValue(Rank.Jack, 11);
  testRankValue(Rank.Queen, 12);
  testRankValue(Rank.King, 13);

  function testRankValue(
    rank: Rank,
    expectedValue: number,
    aceHigh: boolean | null = null
  ) {
    let testDescription: string =
      "Rank " + rank + " has value of " + expectedValue;
    if (aceHigh !== null) {
      testDescription += " with ace forced " + (aceHigh ? "high" : "low");
    }

    test(testDescription, () => {
      if (aceHigh === null) {
        expect(rankValue(rank)).toBe(expectedValue);
      } else {
        expect(rankValue(rank, aceHigh)).toBe(expectedValue);
      }
    });
  }
});

describe("getHighestRank suite", () => {
  let cards: Array<ICard>;

  testGetHighestRank([], Rank.None);
  testGetHighestRank([Rank.Two], Rank.Two);
  testGetHighestRank([Rank.Two, Rank.Three], Rank.Three);
  testGetHighestRank([Rank.Two, Rank.Three], Rank.Three, [Rank.Two]);

  testGetHighestRank([Rank.Two, Rank.Three, Rank.Ace], Rank.Ace);
  testGetHighestRank([Rank.Two, Rank.Three, Rank.Ace], Rank.Three, [], false);
  testGetHighestRank([Rank.Two, Rank.Three, Rank.Ace], Rank.Ace, [], true);
  testGetHighestRank(
    [Rank.Two, Rank.Three, Rank.Ace],
    Rank.Three,
    [Rank.Ace],
    true
  );

  function testGetHighestRank(
    ranks: Array<Rank>,
    expectedRank: Rank,
    excludeRanks: Array<Rank> = [],
    aceHigh: boolean | null = null
  ) {
    // Function to test input assortment of ranks
    let testDescription: string;
    let cards: Array<ICard>;

    if (ranks.length === 0) {
      testDescription = "No cards";
    } else {
      testDescription = ranks.toString();
    }

    if (excludeRanks.length !== 0) {
      testDescription += " excluding " + excludeRanks.toString();
    }
    if (aceHigh != null) {
      testDescription += " with ace forced " + (aceHigh ? "high" : "low");
    }
    testDescription += " has highest rank of " + expectedRank;

    // Make array of cards consistent with provided ranks
    cards = ranks.map((rank: Rank) => {
      return { suit: Suit.Club, rank: rank };
    });

    test(testDescription, () => {
      if (aceHigh !== null) {
        expect(getHighestRank(cards, excludeRanks, aceHigh)).toBe(expectedRank);
      } else {
        expect(getHighestRank(cards, excludeRanks)).toBe(expectedRank);
      }
    });
  }
});

describe("getMostFrequentRank suit", () => {
  test("empty card set", () => {
    expect(getMostFrequentRank([])).toBe(Rank.None);
  });

  test("single card", () => {
    expect(getMostFrequentRank([cardObject(Suit.Club, Rank.Ace)])).toBe(Rank.Ace);
  });

  test("multiple cards", () => {
    expect(
      getMostFrequentRank([
        cardObject(Suit.Diamond, Rank.Ace),
        cardObject(Suit.Club, Rank.Ace),
        cardObject(Suit.Diamond, Rank.Five),
        cardObject(Suit.Heart, Rank.Three),
        cardObject(Suit.Club, Rank.Five),
        cardObject(Suit.Heart, Rank.Five),
        cardObject(Suit.Heart, Rank.Nine),
      ])
    ).toBe(Rank.Five);
  });

  test("multiple cards, with exclusion", () => {
    expect(
      getMostFrequentRank(
        [
          cardObject(Suit.Diamond, Rank.Ace),
          cardObject(Suit.Club, Rank.Ace),
          cardObject(Suit.Diamond, Rank.Five),
          cardObject(Suit.Heart, Rank.Three),
          cardObject(Suit.Club, Rank.Five),
          cardObject(Suit.Heart, Rank.Five),
          cardObject(Suit.Heart, Rank.Nine),
        ],
        [Rank.Five]
      )
    ).toBe(Rank.Ace);
  });
});

describe("getMostFrequentSuit suite", () => {
  test("empty card set", () => {
    expect(getMostFrequentSuit([])).toBe(Suit.None);
  });
  test("single card", () => {
    expect(getMostFrequentSuit([cardObject(Suit.Club, Rank.Ace)])).toBe(
      Suit.Club
    );
  });
  test("multiple cards", () => {
    expect(
      getMostFrequentSuit([
        cardObject(Suit.Diamond, Rank.Ace),
        cardObject(Suit.Club, Rank.Ace),
        cardObject(Suit.Heart, Rank.Two),
        cardObject(Suit.Heart, Rank.Three),
        cardObject(Suit.Club, Rank.Five),
        cardObject(Suit.Heart, Rank.Seven),
        cardObject(Suit.Heart, Rank.Nine),
      ])
    ).toBe(Suit.Heart);
  });
});

describe("rankDifference suite", () => {
  // Test ace high and low
  testRankDifference(Rank.Ace, Rank.Two, -1);
  testRankDifference(Rank.Ace, Rank.King, 1);
  testRankDifference(Rank.Two, Rank.Ace, 1);
  testRankDifference(Rank.King, Rank.Ace, -1);
  testRankDifference(Rank.Ace, Rank.Ace, 0);
  testRankDifference(Rank.Ace, Rank.Ace, 0, false);
  testRankDifference(Rank.Ace, Rank.Ace, 0, true);
  testRankDifference(Rank.Ace, Rank.Two, -1, false);
  testRankDifference(Rank.Ace, Rank.Two, 12, true);
  testRankDifference(Rank.Two, Rank.Ace, 1, false);
  testRankDifference(Rank.Two, Rank.Ace, -12, true);

  // Test various combos
  testRankDifference(Rank.Four, Rank.Three, 1);
  testRankDifference(Rank.Three, Rank.Ace, 2);
  testRankDifference(Rank.Two, Rank.Four, -2);
  testRankDifference(Rank.Queen, Rank.Nine, 3);
  testRankDifference(Rank.Two, Rank.Five, -3);
  testRankDifference(Rank.Ten, Rank.King, -3);
  testRankDifference(Rank.Ten, Rank.Seven, 3);
  testRankDifference(Rank.Jack, Rank.Seven, 4);
  testRankDifference(Rank.Ten, Rank.King, -3);
  testRankDifference(Rank.Queen, Rank.Jack, 1);
  testRankDifference(Rank.Ace, Rank.Queen, 2);
  testRankDifference(Rank.Ace, Rank.Three, -2);

  function testRankDifference(
    rankA: Rank,
    rankB: Rank,
    expectedDifference: number,
    aceHigh: boolean | null = null
  ) {
    let testDescription: string;

    // Build description of test
    testDescription =
      rankA +
      " has a value " +
      Math.abs(expectedDifference) +
      " " +
      (expectedDifference > 0 ? "greater than" : "less than") +
      " " +
      rankB;
    if (aceHigh === true) {
      testDescription += " when ace is forced high";
    }

    // Execute the test
    test(testDescription, () => {
      if (aceHigh === null) {
        expect(rankDifference(rankA, rankB)).toBe(expectedDifference);
      } else {
        expect(rankDifference(rankA, rankB, aceHigh)).toBe(expectedDifference);
      }
    });
  }
});

describe("removeDuplicateRankCards suite", () => {
  let cards: Array<ICard>;

  test("empty card set", () => {
    cards = [];
    expect(removeDuplicateRankCards(cards)).toEqual([]);
  });

  test("two pairs, no keep rank", () => {
    cards = [
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.Two),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Heart, Rank.Eight),
    ];
    // Should only keep one of each, does not matter which suit
    cards = removeDuplicateRankCards(cards);
    expect(cards.length).toEqual(5);
    expect(cards[0].rank).toEqual(Rank.Eight);
    expect(cards[1].rank).toEqual(Rank.Six);
    expect(cards[2].rank).toEqual(Rank.Four);
    expect(cards[3].rank).toEqual(Rank.Three);
    expect(cards[4].rank).toEqual(Rank.Two);
  });

  test("two pairs, keep rank specified", () => {
    cards = [
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.Two),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Heart, Rank.Eight),
    ];
    // Should only keep one of each, keeping diamonds if possible
    cards = removeDuplicateRankCards(cards, Suit.Diamond);
    expect(cards.length).toEqual(5);
    expect(cards[0].rank).toEqual(Rank.Eight);
    expect(cards[1].rank).toEqual(Rank.Six);
    expect(cards[2].rank).toEqual(Rank.Four);
    expect(cards[2].suit).toEqual(Suit.Diamond);
    expect(cards[3].rank).toEqual(Rank.Three);
    expect(cards[4].rank).toEqual(Rank.Two);
    expect(cards[4].suit).toEqual(Suit.Diamond);
  });
});

describe("detectPokerHandResult suite", () => {
  let state: PokerHandState;
  let cards: Array<ICard>;

  test("empty card set", () => {
    cards = [];
    state = initializePokerHandState();

    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.None);
    expect(state.finalResultCards).toEqual([]);
    expect(state.finalResultRanks).toEqual([]);
    expect(state.finalResultTieBreakCards).toEqual([]);

    expect(describePokerHandState(Language.English, state)).toEqual("None");
  });

  test("royal flush, with two pairs", () => {
    cards = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Queen),
      cardObject(Suit.Spade, Rank.Jack),
      cardObject(Suit.Spade, Rank.Ten),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.RoyalFlush);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ten);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Jack);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.finalResultCards[3].rank).toEqual(Rank.King);
    expect(state.finalResultCards[4].rank).toEqual(Rank.Ace);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Spade);
    });
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Ace);
    expect(state.finalResultTieBreakCards).toEqual([]);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Royal Flush of Spades"
    );
  });

  test("straight flush, with two pairs", () => {
    cards = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.Two),
      cardObject(Suit.Spade, Rank.Three),
      cardObject(Suit.Spade, Rank.Four),
      cardObject(Suit.Spade, Rank.Five),
      cardObject(Suit.Heart, Rank.Four),
      cardObject(Suit.Heart, Rank.Five),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.StraightFlush);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Three);
    expect(state.finalResultCards[3].rank).toEqual(Rank.Four);
    expect(state.finalResultCards[4].rank).toEqual(Rank.Five);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Spade);
    });
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Five);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Straight Flush of Spades with high card of Five"
    );
  });

  test("four of a kind, with extra triple", () => {
    cards = [
      cardObject(Suit.Club, Rank.Two),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Two),
      cardObject(Suit.Spade, Rank.Two),
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.King),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.FourOfAKind);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[3].rank).toEqual(Rank.Two);
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Two);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Four of a Kind of Twos"
    );
  });

  test("full house, with two pairs", () => {
    cards = [
      cardObject(Suit.Club, Rank.Two),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Two),
      cardObject(Suit.Spade, Rank.Three),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Diamond, Rank.King),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.FullHouse);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[3].rank).toEqual(Rank.King);
    expect(state.finalResultCards[4].rank).toEqual(Rank.King);
    expect(state.finalResultRanks.length).toEqual(2);
    expect(state.finalResultRanks[0]).toEqual(Rank.Two);
    expect(state.finalResultRanks[1]).toEqual(Rank.King);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Full House of Twos and Kings"
    );
  });

  test("flush, with non-suited straight", () => {
    cards = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.Three),
      cardObject(Suit.Spade, Rank.Five),
      cardObject(Suit.Spade, Rank.Seven),
      cardObject(Suit.Spade, Rank.Nine),
      cardObject(Suit.Heart, Rank.Two),
      cardObject(Suit.Heart, Rank.Four),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.Flush);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Nine);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Seven);
    expect(state.finalResultCards[3].rank).toEqual(Rank.Five);
    expect(state.finalResultCards[4].rank).toEqual(Rank.Three);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Spade);
    });
    expect(state.finalResultRanks.length).toEqual(5);
    expect(state.finalResultRanks[0]).toEqual(Rank.Ace);
    expect(state.finalResultRanks[1]).toEqual(Rank.Nine);
    expect(state.finalResultRanks[2]).toEqual(Rank.Seven);
    expect(state.finalResultRanks[3]).toEqual(Rank.Five);
    expect(state.finalResultRanks[4]).toEqual(Rank.Three);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Flush of Spades with high card of Ace"
    );
  });

  test("straight, with two pairs", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Five),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.Straight);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Three);
    expect(state.finalResultCards[3].rank).toEqual(Rank.Four);
    expect(state.finalResultCards[4].rank).toEqual(Rank.Five);
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Five);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Straight with high card of Five"
    );
  });

  test("three of a kind", () => {
    cards = [
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Diamond, Rank.King),
      cardObject(Suit.Heart, Rank.Queen),
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Heart, Rank.Nine),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.ThreeOfAKind);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Queen);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Queen);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Queen);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Three of a Kind of Queens"
    );
  });

  test("two pair, with extra pair", () => {
    cards = [
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Heart, Rank.Jack),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.TwoPair);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[2].rank).toEqual(Rank.King);
    expect(state.finalResultCards[3].rank).toEqual(Rank.King);
    expect(state.finalResultRanks.length).toEqual(2);
    expect(state.finalResultRanks[0]).toEqual(Rank.Ace);
    expect(state.finalResultRanks[1]).toEqual(Rank.King);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Two Pair of Aces and Kings"
    );
  });

  test("single pair", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Two),
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.Five),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.Pair);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Two);
    expect(state.finalResultCards[1].rank).toEqual(Rank.Two);
    expect(state.finalResultRanks.length).toEqual(1);
    expect(state.finalResultRanks[0]).toEqual(Rank.Two);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "Pair of Twos"
    );
  });

  test("high card", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Six),
      cardObject(Suit.Heart, Rank.Two),
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.Five),
    ];
    state = initializePokerHandState();
    detectPokerHandResult(state, cards);
    expect(state.finalResult).toEqual(PokerHandResult.HighCard);
    expect(state.finalResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.finalResultCards[1].rank).toEqual(Rank.King);
    expect(state.finalResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.finalResultCards[3].rank).toEqual(Rank.Jack);
    expect(state.finalResultCards[4].rank).toEqual(Rank.Six);
    expect(state.finalResultRanks.length).toEqual(5);
    expect(state.finalResultRanks[0]).toEqual(Rank.Ace);
    expect(state.finalResultRanks[1]).toEqual(Rank.King);
    expect(state.finalResultRanks[2]).toEqual(Rank.Queen);
    expect(state.finalResultRanks[3]).toEqual(Rank.Jack);
    expect(state.finalResultRanks[4]).toEqual(Rank.Six);

    expect(describePokerHandState(Language.English, state)).toEqual(
      "High Card of Ace"
    );
  });
});

describe("detectPokerHandResult_Detect_Duplicates suite", () => {
  let state: PokerHandState;
  let cards: Array<ICard>;

  test("empty card set", () => {
    cards = [];
    state = initializePokerHandState();

    // Test empty card set
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.None);
    expect(state.duplicateResultCards).toEqual([]);
  });

  test("no duplicates present", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.None);
    expect(state.duplicateResultCards).toEqual([]);
  });

  test("single pair", () => {
    state = initializePokerHandState();
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.Pair);
    expect(state.duplicateResultCards.length).toEqual(2);
    expect(state.duplicateResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[1].rank).toEqual(Rank.Ace);
    expect(state.duplicateKickerCards).toEqual([
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.Nine),
    ]);
  });

  test("two pair", () => {
    // Test two pair
    state = initializePokerHandState();
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.TwoPair);
    expect(state.duplicateResultCards.length).toEqual(4);
    expect(state.duplicateResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[1].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[2].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[3].rank).toEqual(Rank.Five);
    expect(state.duplicateKickerCards).toEqual([
      cardObject(Suit.Heart, Rank.King),
    ]);
  });

  test("three of a kind", () => {
    // Test two pair
    state = initializePokerHandState();
    cards = [
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Spade, Rank.Five),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.ThreeOfAKind);
    expect(state.duplicateResultCards.length).toEqual(3);
    expect(state.duplicateResultCards[0].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[1].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[2].rank).toEqual(Rank.Five);
    expect(state.duplicateKickerCards).toEqual([
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Jack),
    ]);
  });

  test("full house", () => {
    state = initializePokerHandState();
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.FullHouse);
    expect(state.duplicateResultCards.length).toEqual(5);
    expect(state.duplicateResultCards[0].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[1].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[2].rank).toEqual(Rank.Five);
    expect(state.duplicateResultCards[3].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[4].rank).toEqual(Rank.Ace);
    expect(state.duplicateKickerCards).toEqual([]);
  });

  test("four of a kind", () => {
    state = initializePokerHandState();
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    detectPokerHandResult_Detect_Duplicates(state, cards);
    expect(state.duplicateResult).toEqual(PokerHandResult.FourOfAKind);
    expect(state.duplicateResultCards.length).toEqual(4);
    expect(state.duplicateResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[1].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[2].rank).toEqual(Rank.Ace);
    expect(state.duplicateResultCards[3].rank).toEqual(Rank.Ace);
    cards = [cardObject(Suit.Heart, Rank.King)];
  });
});

describe("detectPokerHandResult_Detect_Flush suit", () => {
  let state: PokerHandState;
  let cards: Array<ICard>;

  test("empty card set", () => {
    state = initializePokerHandState();
    cards = [];

    detectPokerHandResult_Detect_Flush(state, cards);
    expect(state.flushResult).toEqual(PokerHandResult.None);
    expect(state.flushResultCards).toEqual([]);
  });

  test("no flush", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Spade, Rank.Seven),
      cardObject(Suit.Club, Rank.Nine),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Flush(state, cards);
    expect(state.flushResult).toEqual(PokerHandResult.None);
    expect(state.flushResultCards).toEqual([]);
  });

  test("single flush", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Spade, Rank.Seven),
      cardObject(Suit.Club, Rank.Nine),
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.King),
    ];
    detectPokerHandResult_Detect_Flush(state, cards);
    expect(state.flushResult).toEqual(PokerHandResult.Flush);
    expect(state.flushResultCards.length).toEqual(5);
    expect(state.flushResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.flushResultCards[1].rank).toEqual(Rank.King);
    expect(state.flushResultCards[2].rank).toEqual(Rank.Jack);
    expect(state.flushResultCards[3].rank).toEqual(Rank.Nine);
    expect(state.flushResultCards[4].rank).toEqual(Rank.Five);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Club);
    });
  });

  test("multiple flushes", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Nine),
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.King),
    ];
    // In case of multiple flushes, the highest cards should be kept
    detectPokerHandResult_Detect_Flush(state, cards);
    expect(state.flushResult).toEqual(PokerHandResult.Flush);
    expect(state.flushResultCards.length).toEqual(5);
    expect(state.flushResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.flushResultCards[1].rank).toEqual(Rank.King);
    expect(state.flushResultCards[2].rank).toEqual(Rank.Jack);
    expect(state.flushResultCards[3].rank).toEqual(Rank.Nine);
    expect(state.flushResultCards[4].rank).toEqual(Rank.Seven);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Club);
    });
  });
});

describe("detectPokerHandResult_Detect_Straight suite", () => {
  let state: PokerHandState;
  let cards: Array<ICard>;

  test("empty card set", () => {
    cards = [];
    state = initializePokerHandState();

    // Test empty card set
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.None);
    expect(state.straightResultCards).toEqual([]);
  });

  test("consecutive cards, but not straight", () => {
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Two),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Eight),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.None);
    expect(state.straightResultCards).toEqual([]);
  });

  test("ace low straight", () => {
    cards = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.Two),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Eight),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.Straight);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Ace);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Two);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Three);
    expect(state.straightResultCards[3].rank).toEqual(Rank.Four);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Five);
  });

  test("ace high straight", () => {
    cards = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Eight),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.Straight);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Ten);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Jack);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.straightResultCards[3].rank).toEqual(Rank.King);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Ace);
  });

  test("multiple straights high", () => {
    cards = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Club, Rank.Nine),
      cardObject(Suit.Club, Rank.Eight),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.Straight);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Ten);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Jack);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.straightResultCards[3].rank).toEqual(Rank.King);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Ace);
  });

  test("multiple straights low", () => {
    cards = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.Two),
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Heart, Rank.Seven),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.Straight);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Three);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Four);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Five);
    expect(state.straightResultCards[3].rank).toEqual(Rank.Six);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Seven);
  });

  test("straight flush", () => {
    cards = [
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Eight),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.StraightFlush);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Four);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Five);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Six);
    expect(state.straightResultCards[3].rank).toEqual(Rank.Seven);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Eight);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Club);
    });
  });

  test("royal flush", () => {
    cards = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Queen),
      cardObject(Suit.Spade, Rank.Jack),
      cardObject(Suit.Spade, Rank.Ten),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.King),
    ];
    state = initializePokerHandState();
    detectPokerHandResult_Detect_Straight(state, cards);
    expect(state.straightResult).toEqual(PokerHandResult.RoyalFlush);
    expect(state.straightResultCards[0].rank).toEqual(Rank.Ten);
    expect(state.straightResultCards[1].rank).toEqual(Rank.Jack);
    expect(state.straightResultCards[2].rank).toEqual(Rank.Queen);
    expect(state.straightResultCards[3].rank).toEqual(Rank.King);
    expect(state.straightResultCards[4].rank).toEqual(Rank.Ace);
    state.flushResultCards.forEach((card: ICard) => {
      expect(card.suit === Suit.Spade);
    });
  });
});

describe("detectPokerHandResult_DetermineResultValue_Duplicates suite", () => {
  let cards: Array<ICard>;
  let result: PokerHandResult;
  let duplicateRanks: Array<Rank>;

  test("single pair", () => {
    result = PokerHandResult.Pair;
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    duplicateRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
      cards,
      result
    );
    expect(duplicateRanks.length).toBe(1);
    expect(duplicateRanks[0]).toBe(Rank.Ace);
  });

  test("two pair", () => {
    result = PokerHandResult.TwoPair;
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    duplicateRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
      cards,
      result
    );
    expect(duplicateRanks.length).toBe(2);
    expect(duplicateRanks[0]).toBe(Rank.Ace);
    expect(duplicateRanks[1]).toBe(Rank.Five);
  });

  test("three of a kind", () => {
    result = PokerHandResult.ThreeOfAKind;
    cards = [
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Spade, Rank.Five),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    duplicateRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
      cards,
      result
    );
    expect(duplicateRanks.length).toBe(1);
    expect(duplicateRanks[0]).toBe(Rank.Five);
  });

  test("full house", () => {
    result = PokerHandResult.FullHouse;
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    duplicateRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
      cards,
      result
    );
    expect(duplicateRanks.length).toBe(2);
    expect(duplicateRanks[0]).toBe(Rank.Five);
    expect(duplicateRanks[1]).toBe(Rank.Ace);
  });

  test("four of a kind", () => {
    result = PokerHandResult.FourOfAKind;
    cards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Ace),
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Heart, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    duplicateRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
      cards,
      result
    );
    expect(duplicateRanks.length).toBe(1);
    expect(duplicateRanks[0]).toBe(Rank.Ace);
  });
});

describe("identifyPokerWinner suite", () => {
  let roundState: PokerRoundState;
  let riverCards: Array<ICard>;
  let handCardsA: Array<ICard>;
  let handCardsB: Array<ICard>;

  test("A beats B (flush beats straight)", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Diamond, Rank.Six),
      cardObject(Suit.Heart, Rank.Seven),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Flush);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Straight);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("B beats A (high card beaten by pair)", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Heart, Rank.Seven),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandB);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("straight flush comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Club, Rank.Four),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Club, Rank.Seven),
    ];
    handCardsB = [cardObject(Suit.Club, Rank.Ace), cardObject(Suit.Club, Rank.Two)];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(
      PokerHandResult.StraightFlush
    );
    expect(roundState.handStateB.finalResult).toBe(
      PokerHandResult.StraightFlush
    );

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("four of a kind comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Spade, Rank.Five),
    ];
    handCardsB = [
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.Three),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.FourOfAKind);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.FourOfAKind);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("full house triple comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Five),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Spade, Rank.King),
    ];
    handCardsB = [
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.King),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.FullHouse);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.FullHouse);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("full house pair comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Three),
      cardObject(Suit.Diamond, Rank.Three),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.King),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.King),
    ];
    handCardsB = [
      cardObject(Suit.Heart, Rank.Three),
      cardObject(Suit.Spade, Rank.Jack),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.FullHouse);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.FullHouse);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("flush comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Jack),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsA = [
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Club, Rank.Eight),
    ];
    handCardsB = [
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Club, Rank.Six),
    ];
    // Tie is broken by cards in the hand - hand A has a higher flush
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Flush);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Flush);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("straight comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Club, Rank.Nine),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Heart, Rank.Queen),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Ten),
      cardObject(Suit.Spade, Rank.Seven),
    ];
    handCardsB = [
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Spade, Rank.Six),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Straight);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Straight);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("three of a kind comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Club, Rank.Seven),
      cardObject(Suit.Diamond, Rank.Two),
      cardObject(Suit.Diamond, Rank.Ten),
      cardObject(Suit.Heart, Rank.Queen),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Seven),
      cardObject(Suit.Spade, Rank.Seven),
    ];
    handCardsB = [
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Spade, Rank.Six),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );
    expect(roundState.handStateB.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("three of a kind comparison, primary kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Six),
      cardObject(Suit.Club, Rank.Five),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Heart, Rank.Ace),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Six),
      cardObject(Suit.Spade, Rank.King),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );
    expect(roundState.handStateB.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Ace of Hearts which beat King of Spades"
    );
  });

  test("three of a kind comparison, secondary kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Six),
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Six),
      cardObject(Suit.Spade, Rank.Nine),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );
    expect(roundState.handStateB.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Ten of Hearts which beat Nine of Spades"
    );
  });

  test("three of a kind comparison, tie", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Six),
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.King),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Six),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Six),
      cardObject(Suit.Spade, Rank.Nine),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.Tie);
    expect(roundState.handStateA.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );
    expect(roundState.handStateB.finalResult).toBe(
      PokerHandResult.ThreeOfAKind
    );

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("two pair comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.Queen),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Queen),
      cardObject(Suit.Spade, Rank.Ten),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.TwoPair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.TwoPair);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("two pair comparison, kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Queen),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.Six),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.TwoPair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.TwoPair);

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Ten of Hearts which beat Eight of Diamonds"
    );
  });

  test("two pair comparison, tie", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.Ten),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Ace),
      cardObject(Suit.Spade, Rank.Ten),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.Tie);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.TwoPair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.TwoPair);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("pair comparison", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ace),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Ace),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Queen),
      cardObject(Suit.Spade, Rank.Four),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Pair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("pair comparison, primary kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.Jack),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Queen),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Four),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Pair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Queen of Hearts which beat Jack of Diamonds"
    );
  });

  test("pair comparison, secondary kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Jack),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Four),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Pair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Jack of Hearts which beat Ten of Clubs"
    );
  });

  test("pair comparison, tertiary kicker", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Nine),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Seven),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Pair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(true);
    expect(describePokerRoundResult(Language.English, roundState)).toBe(
      "Tie was broken by Nine of Hearts which beat Eight of Diamonds"
    );
  });

  test("pair comparison, tie", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.King),
      cardObject(Suit.Diamond, Rank.Queen),
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.King),
      cardObject(Suit.Spade, Rank.Four),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.Tie);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.Pair);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.Pair);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("high card, primary", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.King),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Queen),
      cardObject(Suit.Spade, Rank.Five),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.HighCard);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("high card, secondary", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Eight),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Nine),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Seven),
      cardObject(Suit.Spade, Rank.Three),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.HighCard);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("high card, tertiary", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Nine),
      cardObject(Suit.Club, Rank.Six),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Eight),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Seven),
      cardObject(Suit.Spade, Rank.Five),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.HighCard);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("high card, quaternery", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Nine),
      cardObject(Suit.Club, Rank.Eight),
      cardObject(Suit.Diamond, Rank.Four),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Seven),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Six),
      cardObject(Suit.Spade, Rank.Five),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.HighCard);

    expect(roundState.tieBreakerUsed).toBe(false);
  });

  test("high card, quinary", () => {
    roundState = initializePokerRoundState();
    riverCards = [
      cardObject(Suit.Club, Rank.Ten),
      cardObject(Suit.Diamond, Rank.Nine),
      cardObject(Suit.Club, Rank.Eight),
      cardObject(Suit.Diamond, Rank.Seven),
      cardObject(Suit.Heart, Rank.Two),
    ];
    handCardsA = [
      cardObject(Suit.Heart, Rank.Five),
      cardObject(Suit.Heart, Rank.Three),
    ];
    handCardsB = [
      cardObject(Suit.Spade, Rank.Four),
      cardObject(Suit.Spade, Rank.Three),
    ];
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);
    expect(roundState.winner).toBe(PokerWinner.HandA);
    expect(roundState.handStateA.finalResult).toBe(PokerHandResult.HighCard);
    expect(roundState.handStateB.finalResult).toBe(PokerHandResult.HighCard);

    expect(roundState.tieBreakerUsed).toBe(false);
  });
});
