import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  RoundResultEntry,
  RoundResultGetResponsePayload,
} from "@poker-checker/server";

export interface IRoundViewerProps {
  roundResultId: string | undefined;
  isVisible: boolean;
  closeRoundViewer: () => void;
}

enum RoundViewerStatus {
  Loading, // A result is currently being loaded
  Done, // Necessary data has been received
}

const RoundViewer: React.FC<IRoundViewerProps> = ({
  roundResultId,
  isVisible,
  closeRoundViewer,
}: IRoundViewerProps) => {
  const [viewerTitle, setViewerTitle] = useState<string>("");
  const [viewerRoundResult, setViewerRoundResult] =
    useState<RoundResultEntry | null>(null);
  const [viewerStatus, setViewerStatus] = useState<RoundViewerStatus>(
    RoundViewerStatus.Loading
  );

  const handleClose = () => closeRoundViewer();

  useEffect(() => {
    console.log("1 fetch triggered for round ID " + roundResultId);
    //fetchRoundResult();
  }, [roundResultId, isVisible]);

  const fetchRoundResult = async () => {
    setViewerStatus(RoundViewerStatus.Loading);

    console.log("2 fetch triggered for round ID " + roundResultId);

    if (!isVisible) {
      return;
    }

    if (!roundResultId) {
      return;
    }

    console.log("fetch triggered 2");

    // TODO - Move this into API source file
    try {
      const response = await fetch(`/api/roundresult?id=${roundResultId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const responsePayload: RoundResultGetResponsePayload =
        await response.json();

      setViewerRoundResult(responsePayload);

      // TODO REMOVE
      console.log("fetched round result");
      console.log(roundResultId);
      console.log(responsePayload);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{viewerTitle}</Modal.Title>
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
