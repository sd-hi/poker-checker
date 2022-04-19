import { stat } from 'fs';

class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        // Initialize a standard base error with provided info
        super(message);
        this.status = status;
        this.message = message;
    }
}

export default HttpException;
