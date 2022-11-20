import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RoundResult, RoundResultPayloadCard } from "@poker-checker/server";
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

  let modalBody;

  if (roundResult) {
    modalBody = (
      <div>
        <div className="round-viewer-heading">
          <h1>Player {roundResult.outcome.winner} wins!</h1>
        </div>
        <div className="round-viewer-heading">
          <h2>Results</h2>
        </div>
        <div className="round-viewer-results-container">
        </div>
        <div className="round-viewer-heading">
          <h2>Inputs</h2>
        </div>
        <div className="round-viewer-inputs-container">
          <div className="round-viewer-card-set-container">
            <RoundViewerCardSet
              payloadCards={roundResult.input.river.cards}
              title="River"
            ></RoundViewerCardSet>
          </div>
          <div className="round-viewer-card-set-container">
            <RoundViewerCardSet
              payloadCards={roundResult.input.playerA.cards}
              title={roundResult.input.playerA.name}
            ></RoundViewerCardSet>
          </div>
          <div className="round-viewer-card-set-container">
            <RoundViewerCardSet
              payloadCards={roundResult.input.playerB.cards}
              title={roundResult.input.playerB.name}
            ></RoundViewerCardSet>
          </div>
        </div>
      </div>
    );
  } else {
    modalBody = <></>;
  }

  return (
    <>
      <Modal
        show={isVisible}
        dialogClassName="round-viewer-modal"
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalBody}</Modal.Body>

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
  payloadCards: Array<RoundResultPayloadCard>;
  title: string;
}

const RoundViewerCardSet = ({
  payloadCards,
  title,
}: IRoundViewerCardSetProps) => {
  if (!payloadCards) {
    return <></>;
  }

  let cards = payloadCards.map((payloadCard) => {
    return new Card(payloadCard.suit, payloadCard.rank);
  });

  return (
    <div className="round-viewer-card-set-container">
      {title}
      <div className="round-viewer-image-container">
        {cards.map((card: Card) => {
          return <CardImage onClick={() => {}} card={card} />;
        })}
      </div>
    </div>
  );
};

export default RoundViewer;
