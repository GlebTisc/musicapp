import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import cookieParser from 'cookie-parser';

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

app.use('/api', routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404, 'Not Found Error'));
});

app.use(errorHandler);

export default app;