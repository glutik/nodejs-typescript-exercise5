import winston from 'winston';

export const createExpressWinstonOptions = () => ({
    transports: [
        new winston.transports.Console(),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint(),
    ),
});

export const createLogger = (name: string) => {
    const options = createExpressWinstonOptions();

    const logger = winston.createLogger({
        transports: options.transports,
        format: options.format,
        defaultMeta: {
            name,
        },
    });

    return logger;
};
