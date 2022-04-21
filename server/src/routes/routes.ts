import { Request, Router } from 'express';
import authMiddleware from '../features/auth/authMiddleware';
import authController from '../features/auth/authController';
import upload from '../features/fileUploader/uploadMiddleware';

const router = Router();

router.post('/registration', upload.single('ava'), authController.register);


router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);

router.get('/authed', authMiddleware, (req, res) => {
  res.json({
    msg: 'authed!!'
  });
})

export default router;