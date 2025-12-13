import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';

export interface AuthedRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const payload = jwt.verify(token, config.jwtSecret) as { sub: string };

        req.userId = payload.sub;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
