import { Router } from 'express';
import authController from '../features/auth/authController';

const router = Router();

router.post('/registration', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);

export default router;