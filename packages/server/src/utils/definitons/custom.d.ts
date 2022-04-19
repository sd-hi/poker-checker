import User from '../../resources/user/user.interface'

// Add user to Express request interface

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}