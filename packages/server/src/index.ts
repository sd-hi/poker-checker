import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from './utils/validateEnv';
import PostController from './resources/post/post.controller';
import UserController from './resources/user/user.controller';
import RoundResultController from './resources/roundresult/roundresult.controller';

export * from './resources/post/post.interface'

validateEnv();

const app = new App(
    [
        new PostController(),
        new UserController(),
        new RoundResultController(),
    ],
    Number(process.env.PORT)
);

app.listen();
