import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RoundResult, RoundResultPayloadCard } from "@poker-checker/server";
import { getRoundResult } from "../../api/roundresult";
import {
  cardObject,
  describePokerHandState,
  ICard,
  Language,
  PokerWinner,
} from "@poker-checker/common";
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

enum Player {
  PlayerA,
  PlayerB,
}

enum PlayerWinStatus {
  Win,
  Loss,
  Draw,
}

const RoundViewer: React.FC<IRoundViewerProps> = ({
  isVisible,
  closeRoundViewer,
  roundResultId,
}: IRoundViewerProps) => {
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

  const describeRoundResultWinner = (roundResult: RoundResult) => {
    // Text to describe winner of round result
    if (roundResult.outcome.winner === PokerWinner.HandA) {
      return `${roundResult.input.playerA.name} won!`;
    } else if (roundResult.outcome.winner === PokerWinner.HandB) {
      return `${roundResult.input.playerB.name} won!`;
    } else {
      return "Round was a draw";
    }
  };

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

  const calculatePlayerWinStatus = (
    roundResult: RoundResult,
    player: Player
  ): PlayerWinStatus => {
    // Determine win staus of given player
    switch (roundResult.outcome.winner) {
      case PokerWinner.HandA:
        return player === Player.PlayerA
          ? PlayerWinStatus.Win
          : PlayerWinStatus.Loss;
      case PokerWinner.HandB:
        return player === Player.PlayerB
          ? PlayerWinStatus.Win
          : PlayerWinStatus.Loss;
      default:
        return PlayerWinStatus.Draw;
    }
  };

  const getResultsClassName = (
    roundResult: RoundResult,
    player: Player
  ): string => {
    // Return styling class of given player's result container
    let className = "round-viewer-card-set-container";
    let winStatus = calculatePlayerWinStatus(roundResult, player);

    switch (winStatus) {
      case PlayerWinStatus.Win:
        className += " round-viewer-win";
        break;
      case PlayerWinStatus.Loss:
        className += " round-viewer-loss";
        break;
      default:
        className += " round-viewer-draw";
    }

    return className;
  };

  let modalBody;

  if (roundResult) {
    modalBody = (
      <div className="round-viewer-modal-body">
        <div className="round-viewer-results-container">
          <div className={getResultsClassName(roundResult, Player.PlayerA)}>
            <RoundViewerCardSet
              payloadCards={roundResult.outcome.handStateA.finalResultCards.concat(
                roundResult.outcome.handStateA.finalResultTieBreakCards
              )}
              title={roundResult.input.playerA.name}
              caption={describePokerHandState(
                Language.English,
                roundResult.outcome.handStateA
              )}
            ></RoundViewerCardSet>
          </div>
          <div className={getResultsClassName(roundResult, Player.PlayerB)}>
            <RoundViewerCardSet
              payloadCards={roundResult.outcome.handStateB.finalResultCards.concat(
                roundResult.outcome.handStateB.finalResultTieBreakCards
              )}
              title={roundResult.input.playerB.name}
              caption={describePokerHandState(
                Language.English,
                roundResult.outcome.handStateB
              )}
            ></RoundViewerCardSet>
          </div>
        </div>
        <div className="round-viewer-inputs-container round-viewer-info">
          <RoundViewerCardSet
            payloadCards={roundResult.input.river.cards}
            title="River"
          ></RoundViewerCardSet>
          <RoundViewerCardSet
            payloadCards={roundResult.input.playerA.cards}
            title={roundResult.input.playerA.name}
          ></RoundViewerCardSet>
          <RoundViewerCardSet
            payloadCards={roundResult.input.playerB.cards}
            title={roundResult.input.playerB.name}
          ></RoundViewerCardSet>
        </div>
      </div>
    );
  } else {
    if (status === RoundViewerStatus.Loading) {
      modalBody = <h1>Loading...</h1>;
    } else {
      modalBody = <h1>No data</h1>;
    }
  }

  return (
    <>
      <Modal
        show={isVisible}
        dialogClassName="round-viewer-modal"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>{roundResult && describeRoundResultWinner(roundResult)}</h1>
          </Modal.Title>
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

interface IRoundViewerCardImageSetProps {
  payloadCards: Array<RoundResultPayloadCard>;
}

const RoundViewerCardImageSet = ({
  payloadCards,
}: IRoundViewerCardImageSetProps) => {
  let cards = payloadCards.map((payloadCard) => {
    return cardObject(payloadCard.suit, payloadCard.rank);
  });

  return (
    <div className="round-viewer-image-container">
      {cards.map((card: ICard) => {
        return <CardImage key={card.rank + card.suit} card={card} />;
      })}
    </div>
  );
};

interface IRoundViewerCardSetProps {
  payloadCards: Array<RoundResultPayloadCard>;
  title: string;
  caption?: string;
  small?: boolean;
}

const RoundViewerCardSet = ({
  payloadCards,
  title,
  caption,
}: IRoundViewerCardSetProps) => {
  if (!payloadCards) {
    return <></>;
  }

  return (
    <div className="round-viewer-card-set-container">
      <div className="round-viewer-card-set-title">
        <h4>{title}</h4>
      </div>
      <RoundViewerCardImageSet payloadCards={payloadCards} />
      {caption && <h4>{caption}</h4>}
    </div>
  );
};

export default RoundViewer;
