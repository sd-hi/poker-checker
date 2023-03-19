import { Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../utils/token';
import UserModel from '../resources/user/user.model';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';
import { access } from 'fs';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    // Get bearer (containing JWT) from authorization header
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ error: 'No authorization token provided' });
    }

    // Extract token from bearer
    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Failed to extract token'));
        }

        const user = await UserModel.findById(payload.id)
            .select('-password') // Exclude password from returned data
            .exec();

        if (!user) {
            return next(
                new HttpException(
                    401,
                    'Failed to find user associated with token'
                )
            );
        }
        
        // Got the user for the token, apply it to request
        req.user = user;

        return next();

    } catch (e) {
        return next(new HttpException(401, 'Unauthorized token'));
    }
}

export default authenticatedMiddleware;
