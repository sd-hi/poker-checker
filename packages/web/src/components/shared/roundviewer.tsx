import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RoundResult } from "@poker-checker/server";
import { getRoundResult } from "../../api/roundresult";
import { Card } from "@poker-checker/common";
import CardImage from "./cardimage";

export interface IRoundViewerProps {
  isVisible: boolean;
  closeRoundViewer: () => void;
  roundResultId: string | undefined;
}

enum RoundViewerStatus {
  Loading, // A result is currently being loaded
  Done, // Necessary data has been received
}

const RoundViewer: React.FC<IRoundViewerProps> = ({
  isVisible,
  closeRoundViewer,
  roundResultId,
}: IRoundViewerProps) => {
  const [title, setTitle] = useState<string>("");
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [status, setStatus] = useState<RoundViewerStatus>(
    RoundViewerStatus.Loading
  );

  const handleClose = () => closeRoundViewer();

  useEffect(() => {
    (async () => {
      await fetchRoundResult();
    })();
  }, [roundResultId, isVisible]);

  const fetchRoundResult = async () => {
    setStatus(RoundViewerStatus.Loading);

    if (!isVisible) {
      // Round viewer not visible, no point in fetching
      return;
    }
    if (!roundResultId) {
      // Round result ID not provided
      return;
    }
    if (roundResultId === "") {
      // Blank round result ID provided
      return;
    }

    console.log("fetch triggered 2");

    try {
      // Get round result from the API
      const responsePayload = await getRoundResult(roundResultId);
      if (responsePayload) {
        setRoundResult(responsePayload.roundresult);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let mySet;

  if (roundResult) {
    console.log("SET POPULATED")
    console.log(roundResult)
    console.log(roundResult.input)
    mySet = (
      <RoundViewerCardSet
        cards={roundResult.input.playerA.cards.map((payloadCard) => {
          return new Card(payloadCard.suit, payloadCard.rank);
        })}
        title={roundResult.input.playerA.name}
      ></RoundViewerCardSet>
    );
  } else {
    mySet = <></>;
  }

  return (
    <>
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>{mySet}</div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Round viewer card set is a group of cards to be displayed in the viewer
interface IRoundViewerCardSetProps {
  cards: Array<Card>;
  title: string;
}

const RoundViewerCardSet = ({ cards, title }: IRoundViewerCardSetProps) => {
  if (!cards) {
    return <></>;
  }

  return (
    <div className="round-viewer-card-set-container">
      <div className="round-viewer-card-set-slots">
        {cards.map((card: Card) => {
          return <CardImage onClick={() => {}} card={card} />;
        })}
      </div>
    </div>
  );
};

export default RoundViewer;
