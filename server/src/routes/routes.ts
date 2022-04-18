import { Router } from 'express';
import authMiddleware from '../features/auth/authMiddleware';
import authController from '../features/auth/authController';

const router = Router();

router.post('/registration', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);

router.get('/authed', authMiddleware, (req, res) => {
  res.json({
    msg: 'authed!!'
  });
})

export default router;