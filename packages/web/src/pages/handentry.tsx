import React from "react";
import ButtonBar from "../components/handentry/buttonbar";
import CardChooser from "../components/handentry/cardchooser";
import CardSet from "../components/handentry/cardset";
import { IHandData, useHandEntryContext } from "../components/handentry/context";
import NavigationBar from "../components/shared/navigationbar";

const HandEntry = () => {
  const handEntryContext = useHandEntryContext();

  if (handEntryContext === null) {
    return <></>;
  }
  const hands: Array<IHandData> | null = handEntryContext.roundData.hands;

  return (
    <main>
      <NavigationBar />
      <main className="main-container">
        <div className="card-sets-container">
          {hands.map((hand) => {
            return <CardSet key={hand.id} handId={hand.id} />;
          })}
        </div>
      </main>
      <CardChooser />
      <ButtonBar />
    </main>
  );
};

export default HandEntry;
