import { Request, Router } from 'express';
import authMiddleware from '../features/auth/authMiddleware';
import authController from '../features/auth/authController';
import groupController from '../features/group/groupController';
import upload from '../features/fileUploader/uploadMiddleware';
import friendRequestController from '../features/friendRequest/friendRequestController';
import userController from '../features/user/userController';

const router = Router();

router.post('/registration', upload.single('ava'), authController.register);


router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);


router.post('/group/create', authMiddleware, upload.single('ava'), groupController.create);

// присоединение, приглашение выход из группы
router.get('/group/join/:linkId', authMiddleware, groupController.join);
router.post('/group/:id/invite', authMiddleware, groupController.createInvite);
router.post('/group/:id/leave', authMiddleware, groupController.leave);

router.put('/group/:id/update', authMiddleware, upload.single('ava'), groupController.update);
router.delete('/group/:id/remove', authMiddleware, groupController.remove);

router.get('/group/:id', authMiddleware, groupController.show);

// список групп пользователя и групп где он состоит
router.get('/user-groups', authMiddleware, groupController.userGroups);


// запросы дружбы
router.get('/friend-requests', authMiddleware, friendRequestController.requests);
router.post('/friend-request/:requestedUuid/create', authMiddleware, friendRequestController.create);
router.post('/friend-request/:requestUuid/accept', authMiddleware, friendRequestController.accept);
router.post('/friend-request/:requestUuid/recall', authMiddleware, friendRequestController.recall);
router.post('/friend-request/:requestUuid/decline', authMiddleware, friendRequestController.reject);

// друзья
router.get('/users/friends', authMiddleware, userController.friends);
router.post('/users/friend/:id/remove', authMiddleware, userController.removeFriend);

router.get('/users/search', userController.search);

export default router;