import RoundResultModel from "../../resources/roundresult/roundresult.model";
import RoundResult, {
  RoundResultPostRequestPayload as RoundResultPostRequestPayload,
  RoundResultGetResponsePayload,
  RoundResultPostResponsePayload,
  RoundResultEntry,
} from "../../resources/roundresult/roundresult.interface";
import {
  identifyPokerWinner,
  initializePokerRoundState,
  PokerRoundState,
} from "@poker-checker/common";
import { Card } from "@poker-checker/common";
import { read } from "fs";

class RoundResultService {
  private roundResult = RoundResultModel;

  /**
   * Create a new roundresult
   */
  public async create(
    requestBody: RoundResultPostRequestPayload
  ): Promise<RoundResultPostResponsePayload> {
    let roundState: PokerRoundState;
    let riverCards: Array<Card>;
    let handCardsA: Array<Card>;
    let handCardsB: Array<Card>;
    let roundResultEntry: RoundResultEntry = {} as RoundResultEntry;
    let responsePayload: RoundResultPostResponsePayload =
      {} as RoundResultPostResponsePayload;

    // Extract relevant data from request
    roundState = initializePokerRoundState();
    riverCards = requestBody.river.cards.map(
      (card) => new Card(card.suit, card.rank)
    );
    handCardsA = requestBody.playerA.cards.map(
      (card) => new Card(card.suit, card.rank)
    );
    handCardsB = requestBody.playerB.cards.map(
      (card) => new Card(card.suit, card.rank)
    );

    // Calculate the outcome of the round
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);

    // Build response
    roundResultEntry.input = requestBody;
    roundResultEntry.outcome = roundState;

    try {
      // Write input and response to database
      const roundresult = await this.roundResult.create(roundResultEntry);

      // Return the object ID for the created entry
      responsePayload.id = roundresult._id;

      return responsePayload;

    } catch {
      throw new Error("Unable to create roundresult");
    }
  }

  /**
   * Get an existing roundresult
   */
  public async read(id: any): Promise<RoundResult | null> {
    try {
      // Read input and response from the database
      const roundresult = await this.roundResult.findById(id);

      if (!roundresult) {
        throw new Error("Unable to find round result ID " + id);
      }

      return roundresult;
    } catch {
      throw new Error("Unable to find round result ID " + id);
    }
  }
}

export default RoundResultService;
