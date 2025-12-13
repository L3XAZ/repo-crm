import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: Number(process.env.PORT || 4000),

    mongoUri:
        process.env.MONGO_URI ||
        (process.env.NODE_ENV === 'production'
            ? 'mongodb://mongo:27017/repo-crm'
            : 'mongodb://localhost:27017/repo-crm'),

    jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

    githubToken: process.env.GITHUB_TOKEN || '',
    nodeEnv: process.env.NODE_ENV || 'development',
};
