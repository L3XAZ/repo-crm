import { Response, NextFunction } from 'express';

import { addRepoSchema } from '../dtos/repo.dto';
import { AuthedRequest } from '../middlewares/auth.middleware';
import { repoService } from '../services/repo.service';

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
            const dto = addRepoSchema.parse(req.body);
            const repo = await repoService.addRepo(req.userId!, dto);

            setImmediate(() => {
                repoService.refreshRepo(req.userId!, repo._id.toString()).catch(() => {});
            });

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
    },
};
