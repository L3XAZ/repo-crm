import mongoose from 'mongoose';
import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const app = createApp();

async function connectDb() {
    await mongoose.connect(config.mongoUri, { dbName: 'repo-crm' });
}

async function start() {
    try {
        await connectDb();
        logger.info('Connected to MongoDB');
    } catch (err) {
        logger.error('MongoDB connection failed', err);
        process.exit(1);
    }
    const server = app.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port}`);
    });
    const shutdown = async (signal?: string) => {
        try {
            logger.info('Shutdown initiated', signal ?? '');
            await mongoose.disconnect();
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
            setTimeout(() => {
                logger.error('Forcing shutdown');
                process.exit(1);
            }, 5000).unref();
        } catch (err) {
            logger.error('Error during shutdown', err);
            process.exit(1);
        }
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
    logger.error('Failed to start', err);
    process.exit(1);
});
