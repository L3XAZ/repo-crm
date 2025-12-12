import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(name: string, value?: string): string {
    if (!value) {
        throw new Error(`Missing env var ${name}`);
    }
    return value;
}

export const config = {
    port: Number(process.env.PORT || 4000),
    mongoUri: required('MONGO_URI', process.env.MONGO_URI),
    jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    githubToken: process.env.GITHUB_TOKEN || undefined
};
