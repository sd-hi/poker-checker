import RoundResultModel from '../../resources/roundresult/roundresult.model';
import RoundResult, { RoundResultRequestPayload } from '../../resources/roundresult/roundresult.interface';

class RoundResultService {
    private roundResult = RoundResultModel;

    /**
     * Create a new roundresult
     */
    public async create(requestBody: RoundResultRequestPayload): Promise<RoundResult> {

        try {
            const roundresult = await this.roundResult.create(requestBody);

            return roundresult;
        } catch {
            throw new Error('Unable to create roundresult');
        }
    }
}

export default RoundResultService;
