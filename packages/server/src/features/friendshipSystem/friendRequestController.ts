import { controllerFunction as cf } from '../controller';
import { IFriendRequestService } from './friendRequestService';
import FriendshipSystemEventEmitter from './friendshipSystemEventEmitter';
import { IUserService } from '../user/userService';
import { ControllerMethod } from '../../types';

export interface IFriendRequestController {
  removeFriend: ControllerMethod;
  friends: ControllerMethod;
  requests: ControllerMethod;
  create: ControllerMethod;
  recall: ControllerMethod;
  accept: ControllerMethod;
  reject: ControllerMethod;
}

export const createFriendRequestController = ({ 
  friendRequestService, friendshipEventEmitter, userService 
}:{
  friendRequestService: IFriendRequestService, 
  friendshipEventEmitter: FriendshipSystemEventEmitter,
  userService: IUserService
}) => {
  
  const friendRequestController: IFriendRequestController = {
    removeFriend: cf(async (req: any, res) => {
      const { id } = req.params;
      const result = await userService.removeFriend(req.user.uuid, id);
      friendshipEventEmitter.friendsIsChanged(req.user.uuid);
      friendshipEventEmitter.friendsIsChanged(id);
      res.json(result);
    }),

    friends: cf(async (req: any, res) => {
      const result = await userService.friends(req.user.uuid);
      res.json(result);
    }),

    requests: cf(async (req: any, res) => {
      const userUuid = req.user.uuid;
      const result = await friendRequestService.getRequests(userUuid);
      res.json(result);

    }),

    create: cf(async (req: any, res) => {

      const { requestedUuid } = req.params;
      const userUuid = req.user.uuid;
      const result = await friendRequestService.createRequest(userUuid, requestedUuid);
      res.json(result);

    }),

    recall: cf(async (req: any, res) => {

      const { requestUuid } = req.params;
      const userUuid = req.user.uuid;
      const result = await friendRequestService.recallRequest(userUuid, requestUuid);
      res.json(result);

    }),

    accept: cf(async (req: any, res) => {

      const { requestUuid } = req.params;
      const userUuid = req.user.uuid;
      const result = await friendRequestService.acceptRequest(userUuid, requestUuid);
      res.json(result);

    }),

    reject: cf(async (req: any, res) => {

      const { requestUuid } = req.params;
      const userUuid = req.user.uuid;
      const result = await friendRequestService.declineRequest(userUuid, requestUuid);
      res.json(result);

    })

  };
  return friendRequestController;
}

export default createFriendRequestController;