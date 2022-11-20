import {
  Language,
  Rank,
  Suit,
  PokerHandResult,
  PokerWinner,
  PokerHandResultDescription,
  RankDescription,
  SuitDescription,
} from "./const";
import { ICard } from "./classes";
import { PokerHandState, PokerRoundState } from "./interfaces";

export function rankValue(rank: Rank, aceHigh: boolean = false): number {
  // Get value of given rank

  switch (rank) {
    case Rank.Ace:
      return aceHigh ? 14 : 1;
    case Rank.Jack:
      return 11;
    case Rank.Queen:
      return 12;
    case Rank.King:
      return 13;
    default:
      return parseInt(rank.valueOf().toString());
  }
}

export function rankDifference(
  rankA: Rank,
  rankB: Rank,
  forceAceHigh: boolean = false
): number {
  // Get the difference between two card ranks
  let difference;

  if (rankA === Rank.Ace || rankB === Rank.Ace) {
    // Account for ace being high or low
    let diffAceHigh;
    let diffAceLow;

    if (rankA === Rank.Ace) {
      // Rank A is an ace
      diffAceHigh = rankValue(rankA, true) - rankValue(rankB, forceAceHigh);
      diffAceLow = rankValue(rankA, false) - rankValue(rankB, forceAceHigh);
    } else {
      // Rank B is an ace
      diffAceHigh = rankValue(rankA, forceAceHigh) - rankValue(rankB, true);
      diffAceLow = rankValue(rankA, forceAceHigh) - rankValue(rankB, false);
    }

    // Return whichever was the smallest difference
    if (Math.abs(diffAceHigh) < Math.abs(diffAceLow) || forceAceHigh) {
      difference = diffAceHigh;
    } else {
      difference = diffAceLow;
    }
  } else {
    // No aces to worry about
    difference = rankValue(rankA) - rankValue(rankB);
  }

  return difference;
}

export function removeDuplicateRankCards(
  cards: Array<ICard>,
  keepSuit: Suit = Suit.None
): Array<ICard> {
  // Sort and prune array so it only contains one instance of each rank, rank descending
  let uniqueCards: Array<ICard> = [];

  // Sort cards rank descending with preferred 'keep' suit of any duplicates towards start of array
  cards = cards.sort((cardA, cardB) => {
    if (rankDifference(cardA.rank, cardB.rank) === 0) {
      // Keep any preferred suit at front when a duplicate is discovered
      if (cardA.suit === keepSuit) {
        return -1;
      }
      if (cardB.suit === keepSuit) {
        return 1;
      }
      return 0;
    }

    // Sort rank descending otherwise
    return -1 * rankDifference(cardA.rank, cardB.rank, true);
  });

  // Remove duplicates
  let lastCard: ICard | null = null;
  cards.forEach((card) => {
    if (lastCard === null || card.rank !== lastCard.rank) {
      // Add to unique cards array
      uniqueCards.push(card);
      lastCard = card;
    }
  });

  return uniqueCards;
}

export function getHighestRank(
  cards: Array<ICard>,
  excludeRanks: Array<Rank> = [],
  forceAceHigh: boolean = true
): Rank {
  // Get the highest rank in a set of cards
  let highestRank: Rank;

  highestRank = Rank.None;

  cards.forEach((card: ICard) => {
    if (excludeRanks.includes(card.rank)) {
      // This rank is to be excluded from result
      return;
    }

    if (rankDifference(card.rank, highestRank, forceAceHigh) > 0) {
      // This is the highest rank found so far
      highestRank = card.rank;
    }
  });

  return highestRank;
}

export function getMostFrequentRank(
  cards: Array<ICard>,
  excludeRanks: Array<Rank> = []
): Rank {
  let rankCounts: { [rank: string]: number } = {};
  let mostFrequentRank: Rank = Rank.None;

  // Get counts for each rank and store in object
  cards.forEach((card: ICard) => {
    const rankAsString = card.rank.valueOf().toString();
    if (rankCounts[rankAsString]) {
      rankCounts[rankAsString] += 1;
    } else {
      rankCounts[rankAsString] = 1;
    }
  });

  // Determine which rank occurs the most
  let maxOcc = 0;
  for (const [rankAsString, rankCount] of Object.entries(rankCounts)) {
    if (rankCount > maxOcc && !excludeRanks.includes(<Rank>rankAsString)) {
      maxOcc = rankCount;
      mostFrequentRank = <Rank>rankAsString;
    }
  }

  return mostFrequentRank;
}

export function getMostFrequentSuit(cards: Array<ICard>): Suit {
  // Get the most common suit in a selection of cards
  let suitCounts: { [suit: string]: number } = {};
  let mostFrequentSuit: Suit = Suit.None;

  // Get counts for each suit and store in object
  cards.forEach((card: ICard) => {
    const suitAsString = card.suit.valueOf().toString();
    if (suitCounts[suitAsString]) {
      suitCounts[suitAsString] += 1;
    } else {
      suitCounts[suitAsString] = 1;
    }
  });

  // Determine which suit occurs the most
  let maxOcc = 0;
  for (const [suitAsString, suitCount] of Object.entries(suitCounts)) {
    if (suitCount > maxOcc) {
      maxOcc = suitCount;
      mostFrequentSuit = <Suit>suitAsString;
    }
  }

  return mostFrequentSuit;
}

export function detectPokerHandResult(
  state: PokerHandState,
  cards: Array<ICard>
): void {
  // Determine poker hand result
  let finalResult: PokerHandResult;
  let finalResultCards: Array<ICard>;

  // Four of a Kind, Full House, Three of a Kind, Two Pair, Pair
  detectPokerHandResult_Detect_Duplicates(state, cards);

  // Flush
  detectPokerHandResult_Detect_Flush(state, cards);

  // Royal flush, Straight Flush, Straight
  detectPokerHandResult_Detect_Straight(state, cards);

  // Determine ultimate result
  finalResult = Math.max(
    state.duplicateResult,
    state.flushResult,
    state.straightResult
  );

  switch (finalResult) {
    case PokerHandResult.FourOfAKind:
    case PokerHandResult.FullHouse:
    case PokerHandResult.ThreeOfAKind:
    case PokerHandResult.TwoPair:
    case PokerHandResult.Pair:
      // Result detected by Duplicates check
      finalResultCards = state.duplicateResultCards;
      break;
    case PokerHandResult.Flush:
      // Result detected by Flush check
      finalResultCards = state.flushResultCards;
      break;
    case PokerHandResult.RoyalFlush:
    case PokerHandResult.StraightFlush:
    case PokerHandResult.Straight:
      // Result detected by Straight check
      finalResultCards = state.straightResultCards;
      break;
    default:
      if (cards.length > 0) {
        // No result was detected, resort to high card determination
        finalResult = PokerHandResult.HighCard;

        // Ensure 5 highest cards are chosen
        finalResultCards = [...cards];
        finalResultCards.sort(
          (cardA: ICard, cardB: ICard) =>
            -1 * rankDifference(cardA.rank, cardB.rank, true)
        );
        if (finalResultCards.length > 5) {
          finalResultCards = finalResultCards.slice(0, 5);
        }
      } else {
        // No cards provided, cannot give any result
        finalResult = PokerHandResult.None;
        finalResultCards = [];
      }
  }

  // Apply result to state
  state.finalResult = finalResult;
  state.finalResultCards = finalResultCards;

  // Update state with data which can later be used to compare hand's value with another
  detectPokerHandResult_DetermineResultValue(state);
}

export function detectPokerHandResult_Detect_Duplicates(
  state: PokerHandState,
  cards: Array<ICard>
): void {
  // Detect poker result based on duplicate ranks found
  let rankCounts: { [rank: string]: number }; // Count for each rank in card set

  let duplicateCards: Array<ICard>;
  let duplicateResult: PokerHandResult;
  let kickerCards: Array<ICard>;

  let pairCards: Array<ICard>;
  let pairCount: number; // Number of pairs found

  let tripleCards: Array<ICard>;
  let tripleCount: number; // Number of triples found

  let quadCards: Array<ICard>;
  let quadCount: number; // Number of quadruples found

  rankCounts = {};

  pairCards = [];
  tripleCards = [];
  quadCards = [];

  pairCount = 0;
  tripleCount = 0;
  quadCount = 0;

  duplicateCards = [];
  duplicateResult = PokerHandResult.None;

  // Count how many of each rank is present in card set
  cards.forEach((card: ICard) => {
    const rankAsString = card.rank.valueOf().toString();
    if (rankCounts[rankAsString]) {
      rankCounts[rankAsString] += 1;
    } else {
      rankCounts[rankAsString] = 1;
    }
  });

  // Get counts for duplicates
  for (const [rankAsString, rankCount] of Object.entries(rankCounts)) {
    switch (rankCount) {
      case 4:
        ++quadCount;
        break;
      case 3:
        ++tripleCount;
        break;
      case 2:
        ++pairCount;
        break;
    }
  }

  // Identify cards which make up pairs, triples and quads
  cards.forEach((card: ICard) => {
    const rankAsString = card.rank.valueOf().toString();
    switch (rankCounts[rankAsString]) {
      case 4:
        quadCards.push(card);
        break;
      case 3:
        tripleCards.push(card);
        break;
      case 2:
        pairCards.push(card);
        break;
    }
  });

  // Apply limitations given that only 5 cards matter in ultimate result
  if (quadCount > 0) {
    // Prune everything, only four of a kind matters
    pairCards = [];
    tripleCards = [];
    duplicateResult = PokerHandResult.FourOfAKind;
  } else {
    if (tripleCount > 0) {
      // Prune any lower triples
      let keepRank = getHighestRank(tripleCards);
      tripleCards = tripleCards.filter((card: ICard) => {
        return card.rank === keepRank;
      });
      duplicateResult = PokerHandResult.ThreeOfAKind;

      if (pairCount > 0) {
        // If result is a full house, we only want to keep highest pair
        keepRank = getHighestRank(pairCards, [tripleCards[0].rank]);
        pairCards = pairCards.filter((card: ICard) => {
          return card.rank === keepRank;
        });
        duplicateResult = PokerHandResult.FullHouse;
      }
    } else {
      if (pairCount >= 2) {
        // Two pair result - prune any extra pairs
        let keepRank1 = getHighestRank(pairCards);
        let keepRank2 = getHighestRank(pairCards, [keepRank1]);

        pairCards = pairCards.filter((card: ICard) => {
          return card.rank === keepRank1 || card.rank === keepRank2;
        });

        // Sort remaining pairs descending
        pairCards = pairCards.sort(
          (cardA: ICard, cardB: ICard) =>
            -1 * rankDifference(cardA.rank, cardB.rank, true)
        );

        duplicateResult = PokerHandResult.TwoPair;
      } else if (pairCount === 1) {
        duplicateResult = PokerHandResult.Pair;
      }
    }
  }

  // Build array of all cards that directly contributed to result
  duplicateCards = [...quadCards, ...tripleCards, ...pairCards];

  // Build array of best kickers for use in comparison later, rank descending
  kickerCards = cards.filter((card: ICard) => !duplicateCards.includes(card));
  kickerCards = kickerCards.sort((cardA: ICard, cardB: ICard) =>
    rankDifference(cardB.rank, cardA.rank, true)
  );
  kickerCards = kickerCards.slice(0, 5 - duplicateCards.length);

  // Apply determined results to state
  state.duplicateResult = duplicateResult;
  state.duplicateResultCards = duplicateCards;
  state.duplicateKickerCards = kickerCards;
}

export function detectPokerHandResult_Detect_Flush(
  state: PokerHandState,
  cards: Array<ICard>
): void {
  // Detect any flush for the cards
  let mostFrequentSuit: Suit;
  let flushCards: Array<ICard>;

  mostFrequentSuit = Suit.None;
  flushCards = [];

  if (cards.length < 5) {
    // Not enough cards provided
    state.flushResult = PokerHandResult.None;
    state.flushResultCards = [];
    return;
  }

  // Keep only the most commonly occurring suit
  mostFrequentSuit = getMostFrequentSuit(cards);
  flushCards = cards.filter(
    (card: ICard) => card.suit === mostFrequentSuit
  );

  if (flushCards.length < 5) {
    // Not enough cards of same suit to give a flush
    state.flushResult = PokerHandResult.None;
    state.flushResultCards = [];
    return;
  }

  // Sort the cards in descending rank order (treating ace as high)
  flushCards.sort((cardA: ICard, cardB: ICard) => {
    return -1 * rankDifference(cardA.rank, cardB.rank, true);
  });

  // Trim the set of cards down to the highest 5
  flushCards = flushCards.slice(0, 5);

  state.flushResult = PokerHandResult.Flush;
  state.flushResultCards = flushCards;
}

export function detectPokerHandResult_Detect_Straight(
  state: PokerHandState,
  cards: Array<ICard>
): void {
  // Detect a straight for given set of cards
  let straightResult: PokerHandResult;
  let straightCards: Array<ICard>;
  let isFlush: Boolean;
  let keepSuit: Suit;

  if (cards.length === 0) {
    // No cards provided
    state.straightResult = PokerHandResult.None;
    state.straightResultCards = [];
    return;
  }

  straightCards = [...cards];

  // Identify any frequent suit, to bias straight detection towards any straight flush
  keepSuit = getMostFrequentSuit(straightCards);

  // Remove duplicated ranks and sort rank descending
  straightCards = removeDuplicateRankCards(straightCards, keepSuit);

  // Duplicate an ace at the end to detect low straights
  if (straightCards[0].rank === Rank.Ace) {
    straightCards.push(straightCards[0]);
  }

  // Loop down array to find highest straight
  let straightStartPos = 0;
  let straightLength = 1;
  for (let i: number = 1; i < straightCards.length; i++) {
    if (
      Math.abs(
        rankDifference(
          straightCards[i - 1].rank,
          straightCards[i].rank
        )
      ) > 1
    ) {
      // Not consecutive cards, move straight start position along and start again
      straightStartPos = i;
      straightLength = 1;
    } else {
      straightLength++;
    }

    if (straightLength >= 5) {
      // A straight has been detected
      break;
    }
  }

  if (straightLength < 5) {
    // No straight detected
    straightCards = [];
    straightResult = PokerHandResult.None;
  } else {
    // Get the cards that contributed to the straight
    straightCards = straightCards.slice(
      straightStartPos,
      straightStartPos + straightLength
    );

    // Determine whether straight is a flush (all the same suit)
    isFlush = true;
    straightCards.forEach((card: ICard) => {
      if (card.suit !== keepSuit) {
        isFlush = false;
      }
    });

    if (isFlush) {
      // Straight flush - the entire straight is the same suit
      if (straightCards[straightCards.length - 1].rank === Rank.Ten) {
        straightResult = PokerHandResult.RoyalFlush;
      } else {
        straightResult = PokerHandResult.StraightFlush;
      }
    } else {
      // Regular straight - suit varies amongst straight cards
      straightResult = PokerHandResult.Straight;
    }
  }

  // Re-sort the straight cards to ascending, for cosmetics
  straightCards = straightCards.reverse();

  // Apply result to state
  state.straightResult = straightResult;
  state.straightResultCards = straightCards;
}

export function detectPokerHandResult_DetermineResultValue(
  state: PokerHandState
) {
  // Calculate variables pertaining to a hand's value - to be used in tie-breaker calculations
  let result: PokerHandResult = state.finalResult;
  let resultCards: Array<ICard> = state.finalResultCards;
  let resultRanks: Array<Rank> = [];
  let resultTieBreakCards: Array<ICard> = [];

  switch (result) {
    case PokerHandResult.FourOfAKind:
    case PokerHandResult.FullHouse:
    case PokerHandResult.Pair:
    case PokerHandResult.ThreeOfAKind:
    case PokerHandResult.TwoPair:
      // The ranks of the duplicated cards decide the result
      resultRanks = detectPokerHandResult_DetermineResultValue_Duplicates(
        resultCards,
        result
      );

      // Kickers act as tie-breaker if both players hold equally-ranked duplicates
      resultTieBreakCards = state.duplicateKickerCards;
      break;
    case PokerHandResult.RoyalFlush:
    case PokerHandResult.Straight:
    case PokerHandResult.StraightFlush:
      // The single highest card decides the result
      let isLowStraight = false;
      if (
        result === PokerHandResult.Straight ||
        PokerHandResult.StraightFlush
      ) {
        if (resultCards.some((card: ICard) => card.rank === Rank.Four)) {
          isLowStraight = true;
        }
      }
      resultRanks.push(getHighestRank(resultCards, [], !isLowStraight));
      break;
    case PokerHandResult.Flush:
    case PokerHandResult.HighCard:
      // Multiple highest cards determine the result
      resultRanks = resultCards.map((card: ICard) => card.rank);
      break;
  }

  // Update state with hand value data
  state.finalResultRanks = resultRanks;
  state.finalResultTieBreakCards = resultTieBreakCards;
}

export function detectPokerHandResult_DetermineResultValue_Duplicates(
  cards: Array<ICard>,
  result: PokerHandResult
): Array<Rank> {
  // Get the ranks of the duplicates for tie-breaker comparison, descending strength order
  let duplicateRanks: Array<Rank> = [];

  let mostFrequentRankFirst: Rank;
  let mostFrequentRankSecond: Rank;

  // All duplicates depend on the most frequent rank
  mostFrequentRankFirst = getMostFrequentRank(cards);
  duplicateRanks.push(mostFrequentRankFirst);

  // Some duplicates depend on the second most frequent rank
  switch (result) {
    case PokerHandResult.FullHouse:
    case PokerHandResult.TwoPair:
      mostFrequentRankSecond = getMostFrequentRank(cards, [
        mostFrequentRankFirst,
      ]);
      duplicateRanks.push(mostFrequentRankSecond);
  }

  if (result === PokerHandResult.TwoPair) {
    // For two pairs, the most valuable rank should be first, since frequency will be equal
    duplicateRanks.sort(
      (rankA: Rank, rankB: Rank) => -1 * rankDifference(rankA, rankB, true)
    );
  }

  return duplicateRanks;
}

export function identifyPokerWinner(
  roundState: PokerRoundState,
  riverCards: Array<ICard>,
  handCardsA: Array<ICard>,
  handCardsB: Array<ICard>
): void {
  let handStateA: PokerHandState = roundState.handStateA;
  let handStateB: PokerHandState = roundState.handStateB;

  let winner: PokerWinner = PokerWinner.Tie;

  let cardsA: Array<ICard>;
  let cardsB: Array<ICard>;

  // Combine river with player cards to form two sets for combination analysis
  cardsA = riverCards.concat(handCardsA);
  cardsB = riverCards.concat(handCardsB);

  // Determine the final result of each card set
  detectPokerHandResult(handStateA, cardsA);
  detectPokerHandResult(handStateB, cardsB);

  // If one has a better result than the other, the winner is immediately clear
  if (handStateA.finalResult > handStateB.finalResult) {
    winner = PokerWinner.HandA;
  } else if (handStateB.finalResult > handStateA.finalResult) {
    winner = PokerWinner.HandB;
  } else {
    // If both have same result, need to determine a tie-break

    // Compare strengths of the hands
    for (
      let i = 0;
      i < handStateA.finalResultRanks.length &&
      i < handStateB.finalResultRanks.length;
      i++
    ) {
      let difference = rankDifference(
        handStateA.finalResultRanks[i],
        handStateB.finalResultRanks[i],
        true
      );
      if (difference > 0) {
        winner = PokerWinner.HandA;
        break;
      } else if (difference < 0) {
        winner = PokerWinner.HandB;
        break;
      }
    }

    // If there is still a tie, resort to kickers to determine result
    if (winner === PokerWinner.Tie) {
      for (
        let i = 0;
        i < handStateA.finalResultTieBreakCards.length &&
        i < handStateB.finalResultTieBreakCards.length;
        i++
      ) {
        let difference = rankDifference(
          handStateA.finalResultTieBreakCards[i].rank,
          handStateB.finalResultTieBreakCards[i].rank,
          true
        );
        if (difference > 0) {
          winner = PokerWinner.HandA;
          roundState.tieBreakerUsed = true;
          roundState.tieBreakerWinCard = handStateA.finalResultTieBreakCards[i];
          roundState.tieBreakerLossCard =
            handStateB.finalResultTieBreakCards[i];
          break;
        } else if (difference < 0) {
          winner = PokerWinner.HandB;
          roundState.tieBreakerUsed = true;
          roundState.tieBreakerWinCard = handStateB.finalResultTieBreakCards[i];
          roundState.tieBreakerLossCard =
            handStateA.finalResultTieBreakCards[i];
          break;
        }
      }
    }
  }

  // Apply winner to round state
  roundState.winner = winner;

  return;
}
