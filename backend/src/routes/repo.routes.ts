import { Router } from 'express';
import { body, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { repoController } from '../controllers/repo.controller';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/repos:
 *   get:
 *     summary: Get all repos for user
 *     tags: [Repositories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of repos
 */
router.get('/', repoController.list);

/**
 * @openapi
 * /api/repos:
 *   post:
 *     summary: Add new GitHub repository
 *     tags: [Repositories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddRepoDto'
 *     responses:
 *       201:
 *         description: Repo added
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Repo already exists
 */
router.post(
    '/',
    body('fullName').isString().matches(/^[^/]+\/[^/]+$/),
    repoController.add
);

/**
 * @openapi
 * /api/repos/{id}/refresh:
 *   put:
 *     summary: Refresh repo stats
 *     tags: [Repositories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Repo refreshed
 */
router.put('/:id/refresh', param('id').isMongoId(), repoController.refresh);

/**
 * @openapi
 * /api/repos/{id}:
 *   delete:
 *     summary: Delete repo
 *     tags: [Repositories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Repo deleted
 */
router.delete('/:id', param('id').isMongoId(), repoController.remove);

export default router;
