import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import { NotFoundError } from './utils/errors';

const app: Application = express();

app.use(helmet());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || config.cors.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

export default app;