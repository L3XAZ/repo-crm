import { Router } from 'express';

import { authController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../dtos/auth.dto';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

export default router;
