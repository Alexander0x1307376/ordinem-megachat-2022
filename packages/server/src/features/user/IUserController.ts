import { ControllerMethod } from '../../types';


export interface IUserController {
  search: ControllerMethod;
  groupMembers: ControllerMethod;
  list: ControllerMethod;
  show: ControllerMethod;
  edit: ControllerMethod;
  create: ControllerMethod;
  remove: ControllerMethod;
  friends: ControllerMethod;
  removeFriend: ControllerMethod;
}
