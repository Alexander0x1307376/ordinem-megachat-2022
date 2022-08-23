import { ControllerMethod } from '../../types';


export interface IFriendRequestController {
  requests: ControllerMethod;
  create: ControllerMethod;
  recall: ControllerMethod;
  accept: ControllerMethod;
  reject: ControllerMethod;
}
