import { Router } from 'express';
import authMiddleware from '../features/auth/authMiddleware';
import { IGroupController } from "../features/group/IGroupController";
import upload from '../features/fileUploader/uploadMiddleware';
import { IAuthController } from "../features/auth/IAuthController";
import { IFriendRequestController } from "../features/friendshipSystem/IFriendRequestController";
import { IUserController } from "../features/user/IUserController";
import { IChannelController } from "../features/channels/IChannelController";
import { IImageController } from "../features/image/IImageController";
import { IContactController } from "../features/contacts/IContactController";

export interface IControllers {
  friendRequestController: IFriendRequestController;
  userController: IUserController;
  authController: IAuthController;
  channelController: IChannelController;
  groupController: IGroupController;
  imageController: IImageController;
  contactController: IContactController;
  authMiddleware: any
}

const createRouter = ({
  friendRequestController, userController, authController, 
  channelController, groupController, imageController, authMiddleware,
  contactController
}: IControllers) => {
  
  const router = Router();

  router.post('/registration', upload.single('ava'), authController.register);


  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  router.get('/refresh', authController.refreshToken);

  router.post('/image/upload', authMiddleware, upload.single('ava'), imageController.uploadImage);

  router.post('/group/create', authMiddleware, groupController.create);

  // присоединение, приглашение выход из группы
  router.get('/group/join/:linkId', authMiddleware, groupController.join);
  router.post('/group/:id/invite', authMiddleware, groupController.createInvite);
  router.post('/group/:id/leave', authMiddleware, groupController.leave);

  router.post('/group/:id/update', authMiddleware, groupController.update);
  router.delete('/group/:id/remove', authMiddleware, groupController.remove);
  router.get('/group/:id', authMiddleware, groupController.show);
  // список групп пользователя и групп где он состоит
  router.get('/user-groups', authMiddleware, groupController.userGroups);

  // каналы
  router.get('/channel/:groupId/list', authMiddleware, channelController.list);
  router.post('/channel/create', authMiddleware, channelController.create);
  router.put('/channel/:channelId/update', authMiddleware, channelController.update);
  router.delete('/channel/:channelId/remove', authMiddleware, channelController.remove);
  router.get('/channel/:channelId', authMiddleware, channelController.show);


  // контакты
  router.get('/user-contacts', authMiddleware, contactController.getContactsData);

  // запросы дружбы
  router.get('/friend-requests', authMiddleware, friendRequestController.requests);
  router.post('/friend-request/create', authMiddleware, friendRequestController.create);
  router.post('/friend-request/:requestUuid/accept', authMiddleware, friendRequestController.accept);
  router.post('/friend-request/:requestUuid/recall', authMiddleware, friendRequestController.recall);
  router.post('/friend-request/:requestUuid/decline', authMiddleware, friendRequestController.reject);

  // друзья
  router.get('/users/friends', authMiddleware, friendRequestController.friends);
  router.get('/users/:groupId/members', authMiddleware, userController.groupMembers);
  router.post('/users/friend/:id/remove', authMiddleware, friendRequestController.removeFriend);

  router.get('/users/search', authMiddleware, userController.search);


  router.get('/', (req, res) => {
    res.json({message: 'ok'});
  })

  return router;
}

export default createRouter;