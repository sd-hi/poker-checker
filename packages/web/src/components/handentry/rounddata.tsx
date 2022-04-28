import { Card, Rank, Suit } from "@poker-checker/common";

export interface ICardSlotData {
  id: number;
  card: Card;
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
      id: "river",
      name: "Dealer",
      slots: [
        { id: 1, card: new Card(Suit.None, Rank.None) },
        { id: 2, card: new Card(Suit.None, Rank.None) },
        { id: 3, card: new Card(Suit.None, Rank.None) },
        { id: 4, card: new Card(Suit.None, Rank.None) },
        { id: 5, card: new Card(Suit.None, Rank.None) },
      ],
    },
    {
      id: "playerA",
      name: "Player 1",
      slots: [
        { id: 1, card: new Card(Suit.None, Rank.None) },
        { id: 2, card: new Card(Suit.None, Rank.None) },
      ],
    },
    {
      id: "playerB",
      name: "Player 2",
      slots: [
        { id: 1, card: new Card(Suit.None, Rank.None) },
        { id: 2, card: new Card(Suit.None, Rank.None) },
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
): Card => {
  // Get card located in given identifier key
  let card: Card;
  let slot: ICardSlotData | undefined;

  slot = roundDataGetSlot(roundData, slotKey);

  if (slot !== undefined) {
    card = slot.card;
  } else {
    card = new Card(Suit.None, Rank.None);
  }

  return card;
};

export const roundDataSetCard = (
  roundData: IRoundData,
  slotKey: ISlotKey,
  card: Card
): void => {
  // Apply given card to given slot
  let slot: ICardSlotData | undefined = undefined;

  slot = roundDataGetSlot(roundData, slotKey);

  if (slot !== undefined) {
    slot.card = card;
  }
};
