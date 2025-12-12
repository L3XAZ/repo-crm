import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ error: 'Validation failed', details: errors.array() });
                return;
            }

            const dto = req.body as RegisterDto;
            const result = await authService.register(dto);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ error: 'Validation failed', details: errors.array() });
                return;
            }

            const dto = req.body as LoginDto;
            const result = await authService.login(dto);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
};
