import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/BaseController';
import { TYPES } from '../../injectableTypes';
import { ILogger } from '../../logger/ILogger';
import { IChannelController } from './IChannelController';
import { CookieOptions, NextFunction, Request, Response } from "express";
import { IChannelService } from './IChannelService';
import { AuthGuard } from '../auth/AuthGuard';


@injectable()
export class ChannelController extends BaseController implements IChannelController {
  constructor(
    @inject(TYPES.ChannelService) private channelService: IChannelService,
    @inject(TYPES.ILogger) private loggerService: ILogger
  ) {
    super(loggerService);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: '/:groupId/list',
        method: 'get',
        func: this.list,
        middlewares: [authGuard]
      },
      {
        path: '/create',
        method: 'post',
        func: this.create,
        middlewares: [authGuard]
      },
      {
        path: '/:channelId/update',
        method: 'put',
        func: this.update,
        middlewares: [authGuard]
      },
      {
        path: '/:channelId/remove',
        method: 'delete',
        func: this.remove,
        middlewares: [authGuard]
      },
      {
        path: '/:channelId',
        method: 'get',
        func: this.show,
        middlewares: [authGuard]
      },
    ]);
  }

  async list(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { groupId } = req.params;
    const result = await this.channelService.getList(groupId);
    this.ok(res, result);
  }

  async show(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { channelId } = req.params;
    const result = await this.channelService.getChannelDetails(channelId);
    this.ok(res, result);
  }

  async create(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const postData = req.body;
    const result = await this.channelService.createChannel(postData);
    this.ok(res, result);
  }

  async update(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { channelId } = req.params;
    const postData = req.body;
    const result = await this.channelService.updateChannel(channelId, postData);
    this.ok(res, result);
  }

  async remove(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { channelId } = req.params;
    const result = await this.channelService.removeChannel(channelId);
    this.ok(res, result);
  }
}