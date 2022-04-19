import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    // Validate the environment variables

    cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['development', 'production'] }),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port({ default: 3000 }), // Port is 3000 if not specified in env file
        JWT_SECRET: str(),
    });
}

export default validateEnv;