import { ControllerMethod } from "../../types";


export interface IGroupController {
  createInvite: ControllerMethod;
  join: ControllerMethod;
  leave: ControllerMethod;
  userGroups: ControllerMethod;
  create: ControllerMethod;
  update: ControllerMethod;
  remove: ControllerMethod;
  show: ControllerMethod;
}
