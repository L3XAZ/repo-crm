import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthedRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization token missing' });
        return;
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
        req.userId = payload.sub;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
