import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware';
import validate from '../../resources/roundresult/roundresult.validation';
import RoundResultService from '../../resources/roundresult/roundresult.service';
import RoundResultRequestPayload from './roundresult.interface'
import { compile, required } from 'joi';

class RoundResultController implements Controller {
    public path = '/roundresult';
    public router = Router();
    private RoundResultService = new RoundResultService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {

        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {

        try {
            const roundResult = await this.RoundResultService.create(<RoundResultRequestPayload>req.body);

            res.status(201).json({ roundresult: roundResult });
        } catch (e) {
            if (e instanceof Error) {
                next(new HttpException(400, e.message));
            } else {
                next(new HttpException(400, 'Cannot create roundresult'));
            }
        }
    };
}

export default RoundResultController;
