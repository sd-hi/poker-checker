import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import HttpException from "../../utils/exceptions/http.exception";
import validationMiddleware from "../../middleware/validation.middleware";
import validate from "../../resources/roundhistory/roundhistory.validation";
import RoundHistoryService from "../../resources/roundhistory/roundhistory.service";
import { compile, required } from "joi";

interface RoundHistoryReadParams {
  pageNo: number;
}

class RoundHistoryController implements Controller {
  public path = "/roundhistory";
  public router = Router();
  private RoundHistoryService = new RoundHistoryService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    // GET path for reading history of rounds
    this.router.get(`${this.path}`, this.read);
  }

  private read = async (
    req: Request<{}, {}, {}, RoundHistoryReadParams>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { pageNo } = req.query;

      const roundHistory = await this.RoundHistoryService.read(pageNo);

      res.status(200).json({ roundhistory: roundHistory });
    } catch (e) {
      if (e instanceof Error) {
        next(new HttpException(400, e.message));
      } else {
        next(new HttpException(400, "Failed to read round history"));
      }
    }
  };
}

export default RoundHistoryController;
