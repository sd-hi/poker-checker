import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RoundResultEntry } from "@poker-checker/server";
import { getRoundResult } from "../../api/roundresult";

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
  const [roundResult, setRoundResult] = useState<RoundResultEntry | null>(null);
  const [status, setStatus] = useState<RoundViewerStatus>(
    RoundViewerStatus.Loading
  );

  const handleClose = () => closeRoundViewer();

  useEffect(() => {
    fetchRoundResult();
  }, [roundResultId, isVisible]);

  const fetchRoundResult = async () => {
    setStatus(RoundViewerStatus.Loading);

    console.log("2 fetch triggered for round ID " + roundResultId);

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

    // Get round result from the API
    getRoundResult(roundResultId)
      .then((roundResult) => setRoundResult(roundResult))
      .catch((reason) => console.log(reason));

    console.log(roundResult);
  };

  return (
    <>
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>Sample text</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoundViewer;
