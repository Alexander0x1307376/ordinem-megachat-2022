import 'reflect-metadata';
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "../../common/BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../../logger/ILogger";
import { AuthGuard } from "../auth/AuthGuard";
import { IContactController } from "./IContactController";
import { IContactService } from "./IContactService";

@injectable()
export class ContactController extends BaseController implements IContactController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ContactService) private contactService: IContactService
  ) {
    super(loggerService);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: '/:contactUuid',
        method: 'get',
        func: this.contactDetails,
        middlewares: [authGuard]
      },
      {
        path: '/',
        method: 'get',
        func: this.getContactsData,
        middlewares: [authGuard]
      }
    ]);
  }

  async contactDetails(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const userUuid = req.user.uuid;
    const contactUuid = req.params.contactUuid;
    const result = await this.contactService.getContact(userUuid, contactUuid);
    this.ok(res, result);
  }

  async getContactsData(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const userUuid = req.user.uuid;
    const result = await this.contactService.getUserContacts(userUuid);
    this.ok(res, result);
  }
}