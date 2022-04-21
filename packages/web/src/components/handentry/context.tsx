import React, { useState, useContext } from "react";
import { Card, Suit, Rank } from "@poker-checker/common";

export interface CardSlotData {
  id: number;
  card: Card;
}

export interface HandData {
  id: string;
  name: string;
  slots: Array<CardSlotData>;
}

export interface HandsData {
  hands: Array<HandData>;
}

const initialHands: HandsData = {
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

const AppContext: React.Context<undefined> = React.createContext(undefined);

export interface IProviderProps {
  children?: any;
}

const AppProvider = (props: IProviderProps) => {
  const [hands, setHands] = useState(initialHands);
  const [chooserIsOpen, setChooserIsOpen] = useState(false);
  const [chooserSlot, setChooserSlot] = useState({
    handId: "river",
    slotId: 1,
  });

  const openChooser = (handId: string, slotId: number) => {
    setChooserSlot({ handId: handId, slotId: slotId });
    setChooserIsOpen(true);
  };

  const closeChooser = () => {
    setChooserIsOpen(false);
  };

  const getSlot = (
    handsData: HandsData,
    handId: string,
    slotId: number
  ): CardSlotData | undefined => {
    let slot: CardSlotData | undefined = undefined;
    let hand: HandData | undefined = undefined;

    hand = handsData.hands.find((hand: HandData) => hand.id === handId);
    if (hand !== undefined) {
      slot = hand.slots.find((slot: CardSlotData) => slot.id === slotId);
    }

    return slot;
  };

  const setCard = (
    handId: string,
    slotId: number,
    suit: Suit,
    rank: Rank
  ): void => {
    const newHands: HandsData = [...hands];
    const slot: CardSlotData | undefined = getSlot(newHands, handId, slotId);
    const card: Card = new Card(suit, rank);

    if (slot !== undefined) {
      slot.card = card;
    }
  };

  return (
    // Provide the various functions and state variables to the global state, using context
    <AppContext.Provider
      value={{
        chooserIsOpen,
        chooserSlot,
        closeChooser,
        getSlot,
        hands,
        openChooser,
        setChooserSlot,
        setCard,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useHandEntryContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
