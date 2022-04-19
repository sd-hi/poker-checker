import UserModel from '../../resources/user/user.model';
import User from '../../resources/user/user.interface';
import token from '../../utils/token';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<String | Error> {
        try {
            const existingUser = await this.user.findOne({ email });
            if (existingUser) {
                throw new Error(`User ${email} is already registered`);
            }

            const newUser = await this.user.create({
                name,
                email,
                password,
                role,
            });

            const accessToken = token.createToken(newUser);

            return accessToken;
        } catch (e: any) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw Error('Unable to create user');
            }
        }
    }

    /**
     * Log user in
     */
    public async login(
        email: string,
        password: string
    ): Promise<String | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) {
                throw new Error(`Unable to find user with email ${email}`);
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Incorrect password provided');
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw Error('Unable to log user in');
            }
        }
    }
}

export default UserService;
