import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import {
  IRoundData,
  roundDataGetHandName,
  roundDataSetHandName,
} from "./rounddata";

export interface IPlayerEditorProps {
  roundData: IRoundData;
  isVisible: boolean;
  handId: string;
  closePlayerEditor: () => void;
}

const PlayerEditor: React.FC<IPlayerEditorProps> = ({
  roundData,
  isVisible,
  handId,
  closePlayerEditor,
}: IPlayerEditorProps) => {
  const [error, setError] = useState<string>("");
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    // Close the player editor
    setError("");
    closePlayerEditor();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    // Confirm the changes made to the player
    e.preventDefault();
    setError("");

    if (!nameRef.current || nameRef.current.value === "") {
      return setError("Player name cannot be blank");
    }

    roundDataSetHandName(roundData, handId, nameRef.current.value);
    closePlayerEditor();
  };

  const defaultName = (): string => {
    // Pre-populate existing name if user-edited
    let defaultNameValue = "";
    let existingNameValue = roundDataGetHandName(roundData, handId);

    switch (existingNameValue.toLowerCase()) {
      case "dealer":
      case "player 1":
      case "player 2":
        break;
      default:
        defaultNameValue = existingNameValue;
    }

    return defaultNameValue;
  };

  return (
    <>
      <Modal show={isVisible} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            Editing player ({roundDataGetHandName(roundData, handId)})
          </Modal.Title>
        </Modal.Header>

        <Form className="mt-3 mb-3" onSubmit={(e) => handleSubmit(e)}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter player name"
                ref={nameRef}
                defaultValue={defaultName()}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default PlayerEditor;
