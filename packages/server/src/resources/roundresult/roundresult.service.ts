import RoundResultModel from "../../resources/roundresult/roundresult.model";
import RoundResult, {
  RoundResultRequestPayload,
  RoundResultResponsePayload,
} from "../../resources/roundresult/roundresult.interface";
import {
  identifyPokerWinner,
  initializePokerRoundState,
  PokerRoundState,
} from "@poker-checker/common";
import { Card } from "@poker-checker/common";

class RoundResultService {
  private roundResult = RoundResultModel;

  /**
   * Create a new roundresult
   */
  public async create(
    requestBody: RoundResultRequestPayload
  ): Promise<RoundResult> {
    let roundState: PokerRoundState;
    let riverCards: Array<Card>;
    let handCardsA: Array<Card>;
    let handCardsB: Array<Card>;
    let responseBody: RoundResultResponsePayload =
      {} as RoundResultResponsePayload;

    // Extract relevant data from request
    roundState = initializePokerRoundState();
    riverCards = requestBody.river.cards.map((card) => new Card(card.suit, card.rank));
    handCardsA = requestBody.playerA.cards.map((card) => new Card(card.suit, card.rank));
    handCardsB = requestBody.playerB.cards.map((card) => new Card(card.suit, card.rank));

    // Calculate the outcome of the round
    identifyPokerWinner(roundState, riverCards, handCardsA, handCardsB);

    // Build response
    responseBody.input = requestBody;
    responseBody.outcome = roundState;

    try {
      // Write input and response to database
      const roundresult = await this.roundResult.create(responseBody);

      return roundresult;
    } catch {
      throw new Error("Unable to create roundresult");
    }
  }
}

export default RoundResultService;
