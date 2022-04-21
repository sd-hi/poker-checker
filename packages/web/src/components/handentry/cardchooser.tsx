import React, { useEffect, useState } from "react";
import CardImage from "../shared/cardimage";
import { Button, Modal } from "react-bootstrap";
import { useHandEntryContext } from "./context";
import {
  BsFillSuitClubFill,
  BsFillSuitDiamondFill,
  BsFillSuitHeartFill,
  BsFillSuitSpadeFill,
} from "react-icons/bs";
import { Rank, Suit } from "@poker-checker/common";

const CardChooser = () => {
  const {
    chooserIsOpen,
    chooserSlot,
    closeChooser,
    getSlot,
    hands,
    setCard,
    setChooserSlot,
  } = useHandEntryContext();

  const [selectedRank, setSelectedRank] = useState(Rank.None);
  const [selectedSuit, setSelectedSuit] = useState(Suit.None);

  const handleCardChosen = () => {
    // Confirm single card and close chooser
    setCard(chooserSlot.handId, chooserSlot.slotId, selectedSuit, selectedRank);
    closeChooser();
  };

  const handleCardChosenNext = () => {
    // Confirm card and switch chooser to subsequent slot
    setCard(chooserSlot.handId, chooserSlot.slotId, selectedSuit, selectedRank);

    let nextSlotId = chooserSlot.slotId + 1;
    if (
      nextSlotId <
      hands.find((hand) => hand.id === chooserSlot.handId).slots.length + 1
    ) {
      // Next slot is in current hand
      setChooserSlot({ handId: chooserSlot.handId, slotId: nextSlotId });
    } else {
      //Move to next hand
      nextSlotId = 1;
      let nextHandId;
      switch (chooserSlot.handId) {
        case "river":
          nextHandId = "hand1";
          break;
        case "hand1":
          nextHandId = "hand2";
          break;
        default:
          nextHandId = null;
          break;
      }

      if (nextHandId) {
        setChooserSlot({ handId: nextHandId, slotId: nextSlotId });
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

  useEffect(() => {
    // Pre-load chooser with card in selected slot
    const slot = getSlot(hands, chooserSlot.handId, chooserSlot.slotId);
    setSelectedRank(slot.rank);
    setSelectedSuit(slot.suit);
  }, [chooserSlot, getSlot, hands]);

  return (
    <>
      <Modal show={chooserIsOpen} onHide={closeChooser}>
        <Modal.Header>
          <Modal.Title>
            Choose card ({chooserSlot.handId} - slot {chooserSlot.slotId})
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="card-chooser">
            <div className="card-chooser-image-container">
              <CardImage suit={selectedSuit} rank={selectedRank} />
            </div>
            <div className="card-choices">
              <div className="card-choices-suits">
                {Object.values(Suit).map((suitCode) => {
                  return (
                    <div key={suitCode}>
                      <button
                        className="btn card-choices-suits-btn"
                        onClick={() => setSelectedSuit(suitCode)}
                        style={{
                          backgroundColor: `${
                            suitCode === selectedSuit ? "pink" : "lightblue"
                          }`,
                        }}
                      >
                        {iconForSuit(suitCode)}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div></div>
              <div className="card-choices-ranks">
                {carddef.CARD_RANKS.map((rankCode) => {
                  return (
                    <div key={rankCode}>
                      <button
                        className="btn card-choices-ranks-btn"
                        onClick={() => setSelectedRank(rankCode)}
                        style={{
                          backgroundColor: `${
                            rankCode === selectedRank ? "pink" : "lightblue"
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
