import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import repoRoutes from './routes/repo.routes';

export function createApp() {
    const app = express();

    app.use(helmet());

    app.use(
        cors({
            origin: true,
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(express.json());

    if (config.nodeEnv !== 'test') {
        app.use(morgan('dev'));
    }

    app.use('/api/auth', authRoutes);
    app.use('/api/repos', repoRoutes);

    app.use(errorHandler);

    return app;
}
