import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    port: Number(process.env.PORT || 4000),
    mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/repo-crm",
    jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    nodeEnv: (process.env.NODE_ENV || "development") as
        | "development"
        | "production"
        | "test",
    githubToken: process.env.GITHUB_TOKEN || undefined,
};
