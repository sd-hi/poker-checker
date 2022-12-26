import { ICard, Rank, Suit, cardObject, CardShoe } from "@poker-checker/common";
import { HandId } from "./constants";

export interface ICardSlotData {
  id: number;
  card: ICard;
}

export interface IHandData {
  id: string;
  name: string;
  slots: Array<ICardSlotData>;
}

export interface IRoundData {
  hands: Array<IHandData>;
}

export const initialRoundData: IRoundData = {
  hands: [
    {
      id: HandId.River,
      name: "River",
      slots: [
        { id: 1, card: { suit: Suit.None, rank: Rank.None } },
        { id: 2, card: { suit: Suit.None, rank: Rank.None } },
        { id: 3, card: { suit: Suit.None, rank: Rank.None } },
        { id: 4, card: { suit: Suit.None, rank: Rank.None } },
        { id: 5, card: { suit: Suit.None, rank: Rank.None } },
      ],
    },
    {
      id: HandId.PlayerA,
      name: "Player A",
      slots: [
        { id: 1, card: { suit: Suit.None, rank: Rank.None } },
        { id: 2, card: { suit: Suit.None, rank: Rank.None } },
      ],
    },
    {
      id: HandId.PlayerB,
      name: "Player B",
      slots: [
        { id: 1, card: { suit: Suit.None, rank: Rank.None } },
        { id: 2, card: { suit: Suit.None, rank: Rank.None } },
      ],
    },
  ],
};

export interface ISlotKey {
  handId: string;
  slotId: number;
}

const roundDataGetSlot = (
  roundData: IRoundData,
  slotKey: ISlotKey
): ICardSlotData | undefined => {
  // Get slot for given identifier key
  let hand: IHandData | undefined = undefined;
  let slot: ICardSlotData | undefined = undefined;

  hand = roundData.hands.find((hand: IHandData) => hand.id === slotKey.handId);

  if (hand !== undefined) {
    slot = hand.slots.find((slot: ICardSlotData) => slot.id === slotKey.slotId);
  }

  return slot;
};

export const roundDataCopy = (roundData: IRoundData): IRoundData => {
  // Create a copy of the round data
  const roundDataCopy = { ...roundData };
  return roundDataCopy;
};

export const roundDataGetCard = (
  roundData: IRoundData,
  slotKey: ISlotKey
): ICard => {
  // Get card located in given identifier key
  let card: ICard;
  let slot: ICardSlotData | undefined;

  slot = roundDataGetSlot(roundData, slotKey);

  if (slot !== undefined) {
    card = slot.card;
  } else {
    card = { suit: Suit.None, rank: Rank.None };
  }

  return card;
};

export const roundDataSetCard = (
  roundData: IRoundData,
  slotKey: ISlotKey,
  card: ICard
): void => {
  // Apply given card to given slot
  let slot: ICardSlotData | undefined = undefined;

  slot = roundDataGetSlot(roundData, slotKey);

  if (slot !== undefined) {
    slot.card = card;
  }
};

export const roundDataGetHand = (
  roundData: IRoundData,
  handId: string
): IHandData | undefined => {
  let hand: IHandData | undefined;

  hand = roundData.hands.find((hand: IHandData) => hand.id === handId);

  return hand;
};

export const roundDataGetHandName = (
  roundData: IRoundData,
  handId: string
): string => {
  // Get player name associated with given hand ID
  let handName: string = "";
  let hand: IHandData | undefined = roundDataGetHand(roundData, handId);

  if (hand) {
    if (hand.name !== "") {
      handName = hand.name;
    } else {
      handName = handId;
    }
  }

  if (handName === "") {
    handName = "Unknown";
  }

  return handName;
};

export const roundDataSetHandName = (
  roundData: IRoundData,
  handId: string,
  name: string
): void => {
  // Set player name associated with given hand ID
  let hand: IHandData | undefined = roundDataGetHand(roundData, handId);

  if (hand) {
    hand.name = name;
  }
};

const roundDataExecuteForAllCards = (
  roundData: IRoundData,
  callbackFn: (card: ICard) => ICard
) => {
  // Execute given callback for every card, returning updated card
  roundData.hands.forEach((hand: IHandData) => {
    hand.slots.forEach((slot: ICardSlotData) => {
      slot.card = callbackFn(slot.card);
    });
  });
};

export const roundDataClearCards = (roundData: IRoundData) => {
  // Clear cards from every slot
  roundDataExecuteForAllCards(roundData, (card: ICard) => {
    return { suit: Suit.None, rank: Rank.None };
  });
};

export const roundDataRandomizeCards = (roundData: IRoundData) => {
  // Randomly choose a card for each slot
  const shoe: CardShoe = new CardShoe(); // Shoe to deal cards from

  roundDataExecuteForAllCards(roundData, (card: ICard) => {
    // Deal the next card from the shoe, to assign to this slot
    const randomCard = shoe.dealCard();

    if (randomCard === null) {
      // Some issue occurred with the shoe, don't modify
      return card;
    }

    return randomCard;
  });
};
