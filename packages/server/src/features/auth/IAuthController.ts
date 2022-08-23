import { ControllerMethod } from '../../types';


export interface IAuthController {
  register: ControllerMethod;
  login: ControllerMethod;
  logout: ControllerMethod;
  refreshToken: ControllerMethod;
}
