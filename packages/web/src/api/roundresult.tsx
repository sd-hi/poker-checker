import {
  IHandData,
  IRoundData,
  roundDataGetHand,
} from "../components/shared/rounddata";
import { HandId } from "../components/shared/constants";
import { RoundResultPostRequestPayload } from "@poker-checker/server";

export async function submitRoundResult(
  roundData: IRoundData
): Promise<string> {
  // Submit round result to roundresult interface

  // Build payload to submit
  const requestPayload: RoundResultPostRequestPayload | undefined =
    submitRoundResult_BuildRequestPayLoad(roundData);

  // Submit the payload to API
  const response = await fetch("/api/roundresult", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  // Get response JSON
  const responsePayload = await response.json();

  // Return round result ID created
  return responsePayload.roundresult.id;
}

function submitRoundResult_BuildRequestPayLoad(
  roundData: IRoundData
): RoundResultPostRequestPayload | undefined {
  // Build build a request payload from round data
  let requestPayload: RoundResultPostRequestPayload = {
    river: {},
    playerA: {},
    playerB: {},
  } as RoundResultPostRequestPayload;
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
  requestPayload.river.cards = handRiver.slots.map((slot) => {
    return { suit: slot.card.getSuit(), rank: slot.card.getRank() };
  });

  // Populate player 1 cards and name
  requestPayload.playerA.cards = handPlayerA.slots.map((slot) => {
    return { suit: slot.card.getSuit(), rank: slot.card.getRank() };
  });
  requestPayload.playerA.name = handPlayerA.name;

  // Populate player 2 cards and name
  requestPayload.playerB.cards = handPlayerB.slots.map((slot) => {
    return { suit: slot.card.getSuit(), rank: slot.card.getRank() };
  });
  requestPayload.playerB.name = handPlayerB.name;

  return requestPayload;
}
