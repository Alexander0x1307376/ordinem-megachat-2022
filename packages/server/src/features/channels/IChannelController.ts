import { ControllerMethod } from "../../types";



export interface IChannelController {
  list: ControllerMethod;
  show: ControllerMethod;
  create: ControllerMethod;
  update: ControllerMethod;
  remove: ControllerMethod;
}
