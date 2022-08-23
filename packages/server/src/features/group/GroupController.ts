import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/BaseController';
import { TYPES } from '../../injectableTypes';
import { ILogger } from '../../logger/ILogger';
import { AuthGuard } from '../auth/AuthGuard';
import { IGroupController } from "./IGroupController";
import { IGroupService } from './IGroupService';

@injectable()
export class GroupController extends BaseController implements IGroupController {

  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.GroupService) private groupService: IGroupService
  ) {
    super(loggerService);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: '/user-groups',
        method: 'get',
        func: this.userGroups,
        middlewares: [authGuard]
      },
      {
        path: '/create',
        method: 'post',
        func: this.create,
        middlewares: [authGuard]
      },
      {
        path: '/join/:linkId',
        method: 'get',
        func: this.join,
        middlewares: [authGuard]
      },
      {
        path: '/:id/invite',
        method: 'post',
        func: this.createInvite,
        middlewares: [authGuard]
      },
      {
        path: '/:id/leave',
        method: 'post',
        func: this.leave,
        middlewares: [authGuard]
      },
      {
        path: '/:id/update',
        method: 'post',
        func: this.update,
        middlewares: [authGuard]
      },
      {
        path: '/:id/remove',
        method: 'delete',
        func: this.remove,
        middlewares: [authGuard]
      },
      {
        path: '/:id',
        method: 'get',
        func: this.show,
        middlewares: [authGuard]
      },
    ])
  }

  async createInvite(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    const result = await this.groupService.createInvite(req.user.uuid, id);
    this.ok(res, result);
  }


  // присоединиться к группе
  async join(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { linkId } = req.params;

    const result = await this.groupService.joinGroup(req.user.uuid, linkId);
    this.ok(res, result);
  }

  // покинуть группу
  async leave(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    const result = await this.groupService.leaveGroup(req.user.uuid, id);
    this.ok(res, result);

  }


  // получить список групп пользователя, с которыми он связан (владелец или член)
  async userGroups(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.groupService.userGroups(req.user.uuid);
    this.ok(res, result);
  }


  // создать группу
  async create(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {

    const result = await this.groupService.create({
      ownerUuid: req.user.uuid,
      ...req.body,
    });
    this.ok(res, result);
  }


  // изменить группу
  async update(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {

    const { id } = req.params;

    const result = await this.groupService.update(
      id, {
      ownerUuid: req.user.uuid,
      ...req.body,
    }
    );
    this.ok(res, result);
  }


  // снести группу
  async remove(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    this.ok(res, { message: 'remove' });
  }


  // показать данные группы
  async show(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    const result = await this.groupService.groupDetails(id);
    this.ok(res, result);
  }
} 