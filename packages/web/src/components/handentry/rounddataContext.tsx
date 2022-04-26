import React, { useContext } from "react";
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

const initialRoundData: IRoundData = {
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

export interface RoundDataContextProps {
  roundData: IRoundData;
  setCard: (slotKey: ISlotKey, card: Card) => void;
  getCard: (slotKey: ISlotKey) => Card | null;
  getSlot: (slotKey: ISlotKey) => ICardSlotData | null;
}

export const RoundDataContext = React.createContext<RoundDataContextProps>({
  roundData: initialRoundData,
  setCard: () => {},
  getCard: () => {
    return null;
  },
  getSlot: () => {
    return null;
  },
});

const RoundDataProvider: React.FC<React.ReactNode> = () => {
  const [roundData, setRoundData] =
    React.useState<IRoundData>(initialRoundData);

  const getSlot = (slotKey: ISlotKey): ICardSlotData | null => {
    const hand = roundData.hands.find(
      (hand: IHandData) => hand.id === slotKey.handId
    );
    if (!hand) {
      // Failed to find given hand ID
      return null;
    }

    const slot = hand.slots.find(
      (slot: ICardSlotData) => slot.id === slotKey.slotId
    );
    if (!slot) {
      // Failed to find given slot ID
      return null;
    }

    return slot;
  };

  const setCard = (slotKey: ISlotKey, card: Card) => {
    const newCard: Card = new Card(card.getSuit(), card.getRank());
    const slot: ICardSlotData | null = getSlot(slotKey);

    if (!slot) {
      // Failed to find slot to be updated
      return;
    }

    slot.card = newCard;
  };

  const getCard = (slotKey: ISlotKey): Card | null => {
    const slot: ICardSlotData | null = getSlot(slotKey);

    if (!slot) {
      // Failed to find slot to read
      return null;
    }

    return slot.card;
  };

  return (
    <RoundDataContext.Provider
      value={{ roundData, setCard, getCard, getSlot }}
    ></RoundDataContext.Provider>
  );
};

export const useRoundDataContext = () => {
  return useContext(RoundDataContext);
};

export { RoundDataContext as AppContext, RoundDataProvider };
