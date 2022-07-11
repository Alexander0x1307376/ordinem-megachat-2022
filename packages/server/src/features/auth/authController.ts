import { CookieOptions } from 'express';
import { ControllerMethod } from '../../types';
import { controllerFunction as cf } from '../controller';
import { IAuthService } from './authService';

// TODO: убрать в более подходящее место
const defaultCookieSettings: CookieOptions = {
  // maxAge: 30 * 24 * 60 * 60 * 1000, //30 дней
  maxAge: 2 * 60 * 1000, // 2 минуты,
  // maxAge: 10 * 1000, // 10 секунд,
  httpOnly: true,
  sameSite: 'lax'
}

export interface IAuthController {
  register: ControllerMethod;
  login: ControllerMethod;
  logout: ControllerMethod;
  refreshToken: ControllerMethod;
}

const createAuthController = (authService: IAuthService) => {



  return {

    register: cf(async (req, res) => {

      const imageData = req.file
        ? {
          name: req.file?.originalname,
          description: req.body.description,
          path: req.file?.path,
        }
        : undefined;

      const result = await authService.registration({ ...req.body, imageData });

      res.json(result);
    }),

    login: cf(async (req, res) => {
      const { login, password } = req.body;
      const result = await authService.login(login, password);

      res.json(result);
    }),

    logout: cf(async (req, res) => {
      const { refreshToken } = req.cookies;
      const result = await authService.logout(refreshToken);
      res.json(result);
    }),

    refreshToken: cf(async (req, res) => {
      const refreshToken = req.headers.refreshtoken as string;
      const result = await authService.refresh(refreshToken! as string);
      res.cookie('refreshToken', result.refreshToken, defaultCookieSettings);
      res.json(result);
    }),

  } as IAuthController;
}
export default createAuthController;