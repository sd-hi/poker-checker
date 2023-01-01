import React, { useState } from "react";
import HandEntryButtonBar from "../components/handentry/buttonbar";
import CardChooser, {
  ICardChooserProps,
} from "../components/handentry/cardchooser";
import CardSet from "../components/handentry/cardset";
import NavigationBar from "../components/shared/navigationbar";
import {
  IHandData,
  initialRoundData,
  IRoundData,
  ISlotKey,
} from "../components/shared/rounddata";
import PlayerEditor, {
  IPlayerEditorProps,
} from "../components/handentry/playereditor";
import { HandId } from "../components/shared/constants";
import RoundViewer, {
  IRoundViewerProps,
} from "../components/shared/roundviewer";
import AlertBox, {
  AlertBoxLevel,
  AlertBoxProps,
} from "../components/shared/alertbox";

const HandEntry = () => {
  const [roundData, setRoundData] = useState<IRoundData>(initialRoundData);
  const [alertBoxProps, setAlertBoxProps] = useState<AlertBoxProps>({
    isVisible: false,
    level: AlertBoxLevel.Info,
    message: "",
    hideAlert: () => {},
  });
  const [chooserProps, setChooserProps] = useState<ICardChooserProps>({
    closeChooser: () => {},
    openChooser: () => {},
    roundData: roundData,
    isVisible: false,
    slotKey: { handId: HandId.River, slotId: 1 },
  });
  const [playerEditorProps, setPlayerEditorProps] =
    useState<IPlayerEditorProps>({
      closePlayerEditor: () => {},
      roundData: roundData,
      isVisible: false,
      handId: HandId.PlayerA,
    });
  const [roundViewerProps, setRoundViewerProps] = useState<IRoundViewerProps>({
    closeRoundViewer: () => {},
    isVisible: false,
    roundResultId: "",
  });

  const showAlertBox = (level: AlertBoxLevel, message: string): void => {
    setAlertBoxProps({
      ...alertBoxProps,
      isVisible: true,
      level: level,
      message: message,
    });
  };

  const hideAlertBox = () => {
    setAlertBoxProps({
      ...alertBoxProps,
      isVisible: false,
    });
  };

  const closeChooser = (): void => {
    // Close hand entry card chooser dialog
    setChooserProps({ ...chooserProps, isVisible: false });
  };

  const openChooser = (slotKey: ISlotKey): void => {
    // Open hand entry card chooser dialog to edit card in given slot
    setChooserProps({ ...chooserProps, isVisible: true, slotKey: slotKey });
  };

  const closeRoundViewer = (): void => {
    // Close round viewer dialog
    setRoundViewerProps({ ...roundViewerProps, isVisible: false });
  };

  const openRoundViewer = (roundResultId: string): void => {
    // Open the round result viewing dialog
    setRoundViewerProps({
      ...roundViewerProps,
      isVisible: true,
      roundResultId: roundResultId,
    });
  };

  const closePlayerEditor = (): void => {
    // Close player editor dialog
    setPlayerEditorProps({ ...playerEditorProps, isVisible: false });
  };

  const openPlayerEditor = (handId: string): void => {
    // Open player editor dialog
    setPlayerEditorProps({
      ...playerEditorProps,
      isVisible: true,
      handId: handId,
    });
  };
  return (
    <main>
      <NavigationBar />
      <AlertBox {...alertBoxProps} hideAlert={hideAlertBox} />
      <main className="main-container">
        <div className="card-sets-container">
          {roundData.hands.map((hand: IHandData) => {
            return (
              <CardSet
                key={hand.id}
                handId={hand.id}
                roundData={roundData}
                setRoundData={setRoundData}
                openChooser={openChooser}
                openPlayerEditor={openPlayerEditor}
              />
            );
          })}
        </div>
      </main>
      <CardChooser
        {...chooserProps}
        openChooser={openChooser}
        closeChooser={closeChooser}
      />
      <PlayerEditor
        {...playerEditorProps}
        closePlayerEditor={closePlayerEditor}
      />
      <RoundViewer {...roundViewerProps} closeRoundViewer={closeRoundViewer} />
      <HandEntryButtonBar
        hideAlertBox={hideAlertBox}
        openRoundViewer={openRoundViewer}
        roundData={roundData}
        setRoundData={setRoundData}
        showAlertBox={showAlertBox}
      />
    </main>
  );
};

export default HandEntry;
