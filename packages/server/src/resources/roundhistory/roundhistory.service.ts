import RoundResultModel from "../../resources/roundresult/roundresult.model";
import RoundResult, {
  RoundResultPostRequestPayload as RoundResultPostRequestPayload,
  RoundResultGetResponsePayload,
  RoundResultPostResponsePayload,
  RoundResultEntry,
} from "../../resources/roundresult/roundresult.interface";

class RoundHistoryService {
  private roundResult = RoundResultModel;

  /**
   * Get a page of round results
   */
  public async read(
    pageNo: number,
    limit: number = 10
  ): Promise<Array<RoundResult> | null> {
    try {
      // Read input
      const roundresults = await this.roundResult
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((pageNo - 1) * limit);

      if (!roundresults) {
        throw new Error("Unable to get round result history");
      }

      return roundresults;
    } catch {
      throw new Error("Unable to get round result history");
    }
  }
}

export default RoundHistoryService;
