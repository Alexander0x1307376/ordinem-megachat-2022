import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { BaseController } from "../../common/BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../../logger/ILogger";
import { IUserController } from "./IUserController";
import { IUserService } from "./IUserService";
import { NextFunction, Request, Response } from 'express';
import { AuthGuard } from '../auth/AuthGuard';



@injectable()
export class UserController extends BaseController implements IUserController {
  
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,

  ) {
    super(loggerService);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: '/:groupId/members',
        method: 'get',
        func: this.groupMembers,
        middlewares: [authGuard]
      },
      {
        path: '/search',
        method: 'get',
        func: this.search,
        middlewares: [authGuard]
      },
      {
        path: '/friends',
        method: 'get',
        func: this.friends,
        middlewares: [authGuard]
      },
      {
        path: '/friend/:id/remove',
        method: 'post',
        func: this.removeFriend,
        middlewares: [authGuard]
      }
    ])
  }

  async removeFriend(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const result = await this.userService.removeFriend(req.user.uuid, id);
    this.ok(res, result);
  }

  async friends(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.userService.friends(req.user.uuid);
    this.ok(res, result);
  }

  async groupMembers(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    const { groupId } = req.params;
    const result = await this.userService.groupMembers(groupId);
    this.ok(res, result);
  }

  async search(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const userUuid = req.user.uuid;
    const { search } = req.query;
    const result = await this.userService.searchByName(userUuid, search as string);
    this.ok(res, result);
  }

  async list (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { page } = req.params;
    const result = await this.userService.getList(+page);
    this.ok(res, result);
  };

  async show (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const result = await this.userService.getItem(id);
    this.ok(res, result);
  };

  async edit (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, 'edit');
  };

  async create (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, 'create');
  };

  async remove (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, 'remove');
  };
}