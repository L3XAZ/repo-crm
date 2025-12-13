import { Router } from 'express';

import { repoController } from '../controllers/repo.controller';
import { addRepoSchema } from '../dtos/repo.dto';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', repoController.list);

router.post('/', validate(addRepoSchema), repoController.add);

router.put('/:id/refresh', repoController.refresh);

router.delete('/:id', repoController.remove);

export default router;
