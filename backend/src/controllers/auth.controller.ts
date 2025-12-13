import { Request, Response, NextFunction } from 'express';

import { registerSchema, loginSchema } from '../dtos/auth.dto';
import { authService } from '../services/auth.service';

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: false, // dev + Docker
};

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = registerSchema.parse(req.body);
            const result = await authService.register(dto);

            res.cookie('accessToken', result.accessToken, cookieOptions);
            res.cookie('refreshToken', result.refreshToken, cookieOptions);

            res.status(201).json({ user: result.user });
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = loginSchema.parse(req.body);
            const result = await authService.login(dto);

            res.cookie('accessToken', result.accessToken, cookieOptions);
            res.cookie('refreshToken', result.refreshToken, cookieOptions);

            res.status(200).json({ user: result.user });
        } catch (err) {
            next(err);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.refreshToken;
            if (!token) return res.status(401).json({ error: 'Unauthorized' });

            const payload = authService.verifyRefreshToken(token);
            const accessToken = authService.generateAccessToken(payload.sub);

            res.cookie('accessToken', accessToken, cookieOptions);
            res.json({ ok: true });
        } catch (err) {
            next(err);
        }
    },

    async logout(req: Request, res: Response) {
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        res.status(200).json({ ok: true });
    },
};
