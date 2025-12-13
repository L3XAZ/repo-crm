import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

import { config } from '../config';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { UserModel } from '../models/user.model';
import { HttpError } from '../utils/HttpError';

export const authService = {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    },

    generateAccessToken(userId: string): string {
        const payload = { sub: userId };
        const options: SignOptions = { expiresIn: '15m' };
        return jwt.sign(payload, config.jwtSecret, options);
    },

    generateRefreshToken(userId: string): string {
        const payload = { sub: userId };
        const options: SignOptions = { expiresIn: '7d' };
        return jwt.sign(payload, config.jwtSecret, options);
    },

    verifyRefreshToken(token: string): { sub: string } {
        return jwt.verify(token, config.jwtSecret) as { sub: string };
    },

    async register(dto: RegisterDto) {
        const existed = await UserModel.findOne({ email: dto.email }).lean();
        if (existed) {
            throw new HttpError(409, 'Email already in use');
        }

        const passwordHash = await this.hashPassword(dto.password);
        const newUser = await UserModel.create({ email: dto.email, passwordHash });

        const userId = newUser._id.toString();

        return {
            user: { id: userId, email: newUser.email },
            accessToken: this.generateAccessToken(userId),
            refreshToken: this.generateRefreshToken(userId),
        };
    },

    async login(dto: LoginDto) {
        const user = await UserModel.findOne({ email: dto.email });
        if (!user) {
            throw new HttpError(401, 'Invalid credentials');
        }

        const ok = await this.comparePassword(dto.password, user.passwordHash);
        if (!ok) {
            throw new HttpError(401, 'Invalid credentials');
        }

        const userId = user._id.toString();

        return {
            user: { id: userId, email: user.email },
            accessToken: this.generateAccessToken(userId),
            refreshToken: this.generateRefreshToken(userId),
        };
    },
};
