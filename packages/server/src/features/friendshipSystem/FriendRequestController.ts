import 'reflect-metadata'; 
import { inject, injectable } from "inversify";
import { BaseController } from "../../common/BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../../logger/ILogger";
import { IFriendRequestService } from "./IFriendRequestService";
import { IFriendRequestController } from "./IFriendRequestController";
import { NextFunction, Request, Response } from "express";
import { IUserService } from "../user/IUserService";
import { AuthGuard } from "../auth/AuthGuard";


@injectable()
export class FriendRequestController extends BaseController implements IFriendRequestController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.FriendRequestService) private friendRequestService: IFriendRequestService,
    @inject(TYPES.UserService) private userService: IUserService
  ) {
    super(loggerService);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: '/create',
        method: 'post',
        func: this.create,
        middlewares: [authGuard]
      },
      {
        path: '/:requestUuid/accept',
        method: 'post',
        func: this.accept,
        middlewares: [authGuard]
      },
      {
        path: '/:requestUuid/recall',
        method: 'post',
        func: this.recall,
        middlewares: [authGuard]
      },
      {
        path: '/:requestUuid/decline',
        method: 'post',
        func: this.reject,
        middlewares: [authGuard]
      },
      {
        path: '/',
        method: 'get',
        func: this.requests,
        middlewares: [authGuard]
      }
    ]);
  }

  async requests(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const userUuid = req.user.uuid;
    const result = await this.friendRequestService.getRequests(userUuid);
    this.ok(res, result);
  }

  async create(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { requestedName } = req.body;
    const userUuid = req.user.uuid;
    const result = await this.friendRequestService.createRequest(userUuid, requestedName);
    this.ok(res, result);
  }

  async recall(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await this.friendRequestService.recallRequest(userUuid, requestUuid);
    this.ok(res, result);
  }

  async accept(req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await this.friendRequestService.acceptRequest(userUuid, requestUuid);
    this.ok(res, result);
  }

  async reject(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await this.friendRequestService.declineRequest(userUuid, requestUuid);
    this.ok(res, result);
  }
}