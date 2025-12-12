import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered
 *       409:
 *         description: Email already exists
 */
router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    authController.register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Logged in
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login',
    body('email').isEmail(),
    body('password').exists(),
    authController.login
);

export default router;
