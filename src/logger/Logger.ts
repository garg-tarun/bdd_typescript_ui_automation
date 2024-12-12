import * as winston from 'winston';
import colors from '@colors/colors';
import dotenv from 'dotenv';
dotenv.config({path: './env/.env'});

const useCustomFormat = winston.format.printf(({ level, message, timestamp }) => {
    const msg : string = message as string || ''; // Fallback for undefined messages
    const time = timestamp || ''; // Fallback for undefined timestamps
    let colorizedMessage = msg;
    switch (level) {
        case 'error':
            colorizedMessage = colors.red(msg);
            break;
        case 'warn':
            colorizedMessage = colors.yellow(msg);
            break;
        case 'info':
            colorizedMessage = colors.green(msg);
            break;
    }
    return `${timestamp} ${level}: ${colorizedMessage}`
});

//Create a logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        useCustomFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
})

export default logger;