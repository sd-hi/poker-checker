import React, { useEffect, useState } from "react";
import CardImage from "../shared/cardimage";
import { Button, Modal } from "react-bootstrap";
import {
  IHandData,
  ISlotKey,
  roundDataGetCard,
  roundDataSetCard,
  roundDataGetHandName,
} from "./rounddata";
import {
  BsFillSuitClubFill,
  BsFillSuitDiamondFill,
  BsFillSuitHeartFill,
  BsFillSuitSpadeFill,
} from "react-icons/bs";
import { Card, Rank, Suit } from "@poker-checker/common";
import { IRoundData } from "./rounddata";

export interface ICardChooserProps {
  roundData: IRoundData;
  isVisible: boolean;
  slotKey: ISlotKey;
  closeChooser: () => void;
  openChooser: (slotKey: ISlotKey) => void;
}

const CardChooser: React.FC<ICardChooserProps> = ({
  roundData,
  isVisible,
  slotKey,
  closeChooser,
  openChooser,
}: ICardChooserProps) => {
  const [selectedSuit, setSelectedSuit] = useState<Suit>(Suit.None);
  const [selectedRank, setSelectedRank] = useState<Rank>(Rank.None);

  useEffect(() => {
    // Pre-load chooser with card in selected slot
    setSelectedSuit(roundDataGetCard(roundData, slotKey).getSuit());
    setSelectedRank(roundDataGetCard(roundData, slotKey).getRank());
  }, [roundData, slotKey, isVisible]);

  const handleCardChosen = () => {
    // Confirm single card and close chooser
    roundDataSetCard(roundData, slotKey, new Card(selectedSuit, selectedRank));
    closeChooser();
  };

  const handleCardChosenNext = () => {
    // Confirm card and switch chooser to subsequent slot
    roundDataSetCard(roundData, slotKey, new Card(selectedSuit, selectedRank));

    let nextSlotId: number = slotKey.slotId + 1;
    let hand: IHandData | undefined = roundData.hands.find(
      (hand: IHandData) => hand.id === slotKey.handId
    );
    if (!hand) {
      // Failed to find current hand, just close dialog
      closeChooser();
      return;
    }

    if (nextSlotId < hand.slots.length + 1) {
      // Next slot is in current hand
      openChooser({ handId: hand.id, slotId: nextSlotId });
    } else {
      // Move to next hand, open first slot there
      nextSlotId = 1;
      let handNumber: number = roundData.hands.findIndex(
        (hand: IHandData) => hand.id === slotKey.handId
      );
      if (handNumber + 1 < roundData.hands.length) {
        // There is another valid hand to edit, switch to it
        openChooser({
          handId: roundData.hands[handNumber + 1].id,
          slotId: nextSlotId,
        });
      } else {
        // No further hands, just close
        closeChooser();
      }
    }
  };

  const handleClose = () => {
    // Close the chooser modal
    closeChooser();
  };

  const iconForSuit = (suit: Suit) => {
    switch (suit) {
      case Suit.Club:
        return <BsFillSuitClubFill />;
      case Suit.Diamond:
        return <BsFillSuitDiamondFill />;
      case Suit.Heart:
        return <BsFillSuitHeartFill />;
      case Suit.Spade:
        return <BsFillSuitSpadeFill />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            Choose card ({roundDataGetHandName(roundData, slotKey.handId)} - Card{" "}
            {slotKey.slotId})
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="card-chooser">
            <div className="card-chooser-image-container">
              <CardImage
                card={new Card(selectedSuit, selectedRank)}
                onClick={undefined}
              />
            </div>
            <div className="card-choices">
              <div className="card-choices-suits">
                {Object.values(Suit)
                  .filter((suit: Suit) => suit !== Suit.None)
                  .map((suitCode: string) => {
                    const suit: Suit = suitCode as Suit;
                    return (
                      <div key={suitCode}>
                        <button
                          className="btn card-choices-suits-btn"
                          onClick={() => setSelectedSuit(suit)}
                          style={{
                            backgroundColor: `${
                              suit === selectedSuit ? "pink" : "lightblue"
                            }`,
                          }}
                        >
                          {iconForSuit(suit)}
                        </button>
                      </div>
                    );
                  })}
              </div>
              <div></div>
              <div className="card-choices-ranks">
                {Object.values(Rank)
                  .filter((rank: Rank) => rank !== Rank.None)
                  .map((rankCode) => {
                    const rank: Rank = rankCode as Rank;
                    return (
                      <div key={rankCode}>
                        <button
                          className="btn card-choices-ranks-btn"
                          onClick={() => setSelectedRank(rank)}
                          style={{
                            backgroundColor: `${
                              rank === selectedRank ? "pink" : "lightblue"
                            }`,
                          }}
                        >
                          {rankCode}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCardChosen}>
            Confirm
          </Button>
          <Button variant="success" onClick={handleCardChosenNext}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CardChooser;
