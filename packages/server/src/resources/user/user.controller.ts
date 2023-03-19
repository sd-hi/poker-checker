import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware';
import validate from '../../resources/user/user.validation';
import UserService from '../../resources/user/user.service';
import authenticatedMiddleware from '../../middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        // Register route
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        // Login route
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticatedMiddleware, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                'role-user'
            );

            res.status(201).json({ token }); // Return token to log user in
        } catch (e) {
            if (e instanceof Error) {
                next(new HttpException(400, e.message));
            } else {
                next(new HttpException(400, 'Cannot create user'));
            }
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            res.status(200).json({ token }); // Return token to log user in
        } catch (e) {
            if (e instanceof Error) {
                next(new HttpException(400, e.message));
            } else {
                next(new HttpException(400, 'Cannot create user'));
            }
        }
    };

    private getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).json({ user: req.user });
    }
}

export default UserController;
