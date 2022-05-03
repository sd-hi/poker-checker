import {
  IHandData,
  IRoundData,
  roundDataGetCard,
  roundDataGetHand,
} from "../components/handentry/rounddata";
import { HandId } from "../components/shared/constants";
import { RoundResultRequestPayload } from "@poker-checker/server";

export function submitRoundResult(roundData: IRoundData) {
  // Submit round to API's Round Result interface

  // Build payload to submit
  const requestPayload: RoundResultRequestPayload | undefined =
    submitRoundResult_BuildRequestPayLoad(roundData);

  if (!roundData) {
    // Failed to build payload
    return;
  }

  // TODO REMOVE
  console.log(requestPayload);

  // Submit the payload to API
  (async () => {
    const rawResponse = await fetch("/api/roundresult", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    }).then((data) => {
      console.log(data.json());
    });
  })();
}

function submitRoundResult_BuildRequestPayLoad(
  roundData: IRoundData
): RoundResultRequestPayload | undefined {
  // Build build a request payload from round data
  let requestPayload: RoundResultRequestPayload = {
    river: {},
    playerA: {},
    playerB: {},
  } as RoundResultRequestPayload;
  let handRiver: IHandData | undefined;
  let handPlayerA: IHandData | undefined;
  let handPlayerB: IHandData | undefined;

  handRiver = roundDataGetHand(roundData, HandId.River);
  handPlayerA = roundDataGetHand(roundData, HandId.PlayerA);
  handPlayerB = roundDataGetHand(roundData, HandId.PlayerB);

  if (!handRiver || !handPlayerA || !handPlayerB) {
    // Failed to extract necessary data
    return undefined;
  }

  // Populate river cards
  requestPayload.river.cards = handRiver.slots.map((slot) => slot.card);

  // Populate player 1 cards and name
  requestPayload.playerA.cards = handPlayerA.slots.map((slot) => slot.card);
  requestPayload.playerA.name = handPlayerA.name;

  // Populate player 2 cards and name
  requestPayload.playerB.cards = handPlayerB.slots.map((slot) => slot.card);
  requestPayload.playerB.name = handPlayerB.name;

  return requestPayload;
}
