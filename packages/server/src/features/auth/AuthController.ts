import 'reflect-metadata';
import { CookieOptions, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../../common/BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../../logger/ILogger";
import { IAuthController } from "./IAuthController";
import { IAuthService } from "./IAuthService";

// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.get('/refresh', authController.refreshToken);

const defaultCookieSettings: CookieOptions = {
  // maxAge: 30 * 24 * 60 * 60 * 1000, //30 дней
  maxAge: 2 * 60 * 1000, // 2 минуты,
  // maxAge: 10 * 1000, // 10 секунд,
  httpOnly: true,
  sameSite: 'lax'
}
@injectable()
export class AuthController extends BaseController implements IAuthController {

  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.ILogger) private loggerService: ILogger
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: '/login',
        method: 'post',
        func: this.login
      },
      {
        path: '/logout',
        method: 'post',
        func: this.logout
      },
      {
        path: '/refresh',
        method: 'get',
        func: this.refreshToken
      },
    ])
  }

  async register(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const imageData = req.file
      ? {
        name: req.file?.originalname,
        description: req.body.description,
        path: req.file?.path,
      }
      : undefined;

    const result = await this.authService.registration({ ...req.body, imageData });

    this.ok(res, result);
  }

  async login(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { login, password } = req.body;
    const result = await this.authService.login(login, password);
    this.ok(res, result);
  }

  async logout(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { refreshToken } = req.cookies;
    const result = await this.authService.logout(refreshToken);
    this.ok(res, result);
  }

  async refreshToken(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.headers.refreshtoken as string;
    const result = await this.authService.refresh(refreshToken! as string);
    // res.cookie('refreshToken', result.refreshToken, defaultCookieSettings);
    this.ok(res, result);
  }
}