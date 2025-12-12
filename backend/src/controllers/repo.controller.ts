import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { repoService } from '../services/repo.service';
import { AuthedRequest } from '../middlewares/auth.middleware';
import { AddRepoDto } from '../dtos/repo.dto';

export const repoController = {
    async list(req: AuthedRequest, res: Response, next: NextFunction) {
        try {
            const repos = await repoService.listRepos(req.userId!);
            res.json({ repos });
        } catch (err) {
            next(err);
        }
    },

    async add(req: AuthedRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ error: 'Validation failed', details: errors.array() });
                return;
            }

            const dto = req.body as AddRepoDto;
            const repo = await repoService.addRepo(req.userId!, dto);
            res.status(201).json({ repo });
        } catch (err) {
            next(err);
        }
    },

    async refresh(req: AuthedRequest, res: Response, next: NextFunction) {
        try {
            const repo = await repoService.refreshRepo(req.userId!, req.params.id);
            res.json({ repo });
        } catch (err) {
            next(err);
        }
    },

    async remove(req: AuthedRequest, res: Response, next: NextFunction) {
        try {
            await repoService.deleteRepo(req.userId!, req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};
