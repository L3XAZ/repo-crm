import { NextFunction, Request, Response } from 'express';

export interface HttpError extends Error {
    status?: number;
    details?: unknown;
}

export function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction): void {
    const status = err.status && Number.isFinite(err.status) ? err.status : 500;
    const payload: { error: string; details?: unknown } = { error: err.message || 'Internal Server Error' };
    if (err.details) {
        payload.details = err.details;
    }
    res.status(status).json(payload);
}
