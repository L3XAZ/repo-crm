import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import repoRoutes from './routes/repo.routes';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }

    app.use('/api/auth', authRoutes);
    app.use('/api/repos', repoRoutes);

    app.use(errorHandler);

    logger.info('Express app configured');

    return app;
}
