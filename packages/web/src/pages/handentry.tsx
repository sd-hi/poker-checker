import React, { useState } from "react";
import ButtonBar from "../components/handentry/buttonbar";
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

const HandEntry = () => {
  const [roundData] = useState<IRoundData>(initialRoundData);
  const [chooserProps, setChooserProps] = useState<ICardChooserProps>({
    closeChooser: () => {},
    openChooser: () => {},
    roundData: roundData,
    isVisible: false,
    slotKey: { handId: "dealer", slotId: 1 },
  });

  const closeChooser = (): void => {
    // Close hand entry card chooser dialog
    setChooserProps({ ...chooserProps, isVisible: false });
  };

  const openChooser = (slotKey: ISlotKey): void => {
    // Open hand entry card chooser dialog to edit card in given slot
    setChooserProps({ ...chooserProps, isVisible: true, slotKey: slotKey });
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
                openChooser={openChooser}
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
      <ButtonBar />
    </main>
  );
};

export default HandEntry;
