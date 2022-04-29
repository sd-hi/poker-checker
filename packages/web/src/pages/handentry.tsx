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
} from "../components/handentry/rounddata";
import PlayerEditor, {
  IPlayerEditorProps,
} from "../components/handentry/playereditor";
import { isVisible } from "@testing-library/user-event/dist/utils";

const HandEntry = () => {
  const [roundData, setRoundData] = useState<IRoundData>(initialRoundData);
  const [chooserProps, setChooserProps] = useState<ICardChooserProps>({
    closeChooser: () => {},
    openChooser: () => {},
    roundData: roundData,
    isVisible: false,
    slotKey: { handId: "dealer", slotId: 1 },
  });
  const [playerEditorProps, setPlayerEditorProps] =
    useState<IPlayerEditorProps>({
      closePlayerEditor: () => {},
      roundData: roundData,
      isVisible: false,
      handId: "dealer",
    });

  const closeChooser = (): void => {
    // Close hand entry card chooser dialog
    setChooserProps({ ...chooserProps, isVisible: false });
  };

  const openChooser = (slotKey: ISlotKey): void => {
    // Open hand entry card chooser dialog to edit card in given slot
    setChooserProps({ ...chooserProps, isVisible: true, slotKey: slotKey });
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
      <HandEntryButtonBar roundData={roundData} setRoundData={setRoundData} />
    </main>
  );
};

export default HandEntry;
