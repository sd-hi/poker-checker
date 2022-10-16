import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validate from "../../resources/roundresult/roundresult.validation";
import RoundResultService from "../../resources/roundresult/roundresult.service";
import RoundResultPostRequestPayload from "./roundresult.interface";
import { compile, required } from "joi";

class RoundResultController implements Controller {
  public path = "/roundresult";
  public router = Router();
  private RoundResultService = new RoundResultService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    // GET path for reading existing results
    this.router.get(`${this.path}`, this.read);

    // POST path for creating results
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
      const roundResult = await this.RoundResultService.create(req.body);

      res.status(201).json({ roundresult: roundResult });
    } catch (e) {
      if (e instanceof Error) {
        next(new HttpException(400, e.message));
      } else {
        next(new HttpException(400, "Cannot create roundresult"));
      }
    }
  };

  private read = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(req.query)
      const roundResult = await this.RoundResultService.read(req.query.id);

      res.status(200).json({ roundresult: roundResult });
    } catch (e) {
      if (e instanceof Error) {
        next(new HttpException(400, e.message));
      } else {
        next(new HttpException(400, "Failed to read roundresult"));
      }
    }
  };
}

export default RoundResultController;
