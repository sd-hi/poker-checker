import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from './utils/validateEnv';
import PostController from './resources/post/post.controller';
import UserController from './resources/user/user.controller';
import RoundResultController from './resources/roundresult/roundresult.controller';
import RoundHistoryController from './resources/roundhistory/roundhistory.controller';

export * from './resources/post/post.interface'
export * from './resources/roundresult/roundresult.interface'

validateEnv();

const app = new App(
    [
        new PostController(),
        new UserController(),
        new RoundHistoryController(),
        new RoundResultController(),
    ],
    Number(process.env.PORT)
);

app.listen();
