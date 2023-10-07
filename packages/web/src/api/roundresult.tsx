import {
  IHandData,
  IRoundData,
  roundDataGetHand,
} from "../components/shared/rounddata";
import { HandId } from "../components/shared/constants";
import { RoundResultPostRequestPayload } from "@poker-checker/server";
import {
  RoundHistoryGetResponsePayload,
  RoundResultGetResponsePayload,
} from "@poker-checker/server";

export async function getRoundResult(
  roundResultId: string
): Promise<RoundResultGetResponsePayload | undefined> {
  // Request API for round result of given ID

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
    return responsePayload;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoundResultHistory(
  pageNo: number
): Promise<RoundHistoryGetResponsePayload | undefined> {
  // Request API for given page of round results

  try {
    const response = await fetch(`/api/roundhistory?${pageNo}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const responsePayload: RoundHistoryGetResponsePayload =
      await response.json();
    return responsePayload;
  } catch (error) {
    console.log(error);
  }
}

export async function postRoundResult(roundData: IRoundData): Promise<string> {
  // Submit round result to roundresult interface
  let responsePayload;

  // Build payload to submit
  const requestPayload: RoundResultPostRequestPayload | undefined =
    postRoundResult_BuildRequestPayLoad(roundData);

  // Submit the payload to API
  const response = await fetch("/api/roundresult", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  }).catch((error) => {
    throw new Error(error);
  });

  if (!response) {
    return "";
  }

  // Parse JSON payload
  responsePayload = await response.json();
  if (response.ok) {
    // Return round result ID created
    return responsePayload.id;
  } else {
    // Failed request, return error from API
    throw new Error(responsePayload.message);
  }
}

function postRoundResult_BuildRequestPayLoad(
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
    return { suit: slot.card.suit, rank: slot.card.rank };
  });

  // Populate player 1 cards and name
  requestPayload.playerA.cards = handPlayerA.slots.map((slot) => {
    return { suit: slot.card.suit, rank: slot.card.rank };
  });
  requestPayload.playerA.name = handPlayerA.name;

  // Populate player 2 cards and name
  requestPayload.playerB.cards = handPlayerB.slots.map((slot) => {
    return { suit: slot.card.suit, rank: slot.card.rank };
  });
  requestPayload.playerB.name = handPlayerB.name;

  return requestPayload;
}
