import 'reflect-metadata';
import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../../common/IMiddleware";
import { ITokenService } from "./ITokenService";
import { verify } from 'jsonwebtoken';

/**
 * AuthMiddleware получает заголовок authorization в реквесте,
 * извлекает из него данные юзера и крепит их к реквесту 
 * для дальнейшего использования в AuthGuard
 */
export class AuthMiddleware implements IMiddleware {
  secret: string;
  constructor(
    private tokenService: ITokenService
  ) {
    this.secret = process.env.JWT_ACCESS_SECRET as string;
  }

  execute(req: Request | any, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      verify(req.headers.authorization.split(' ')[1], this.secret, (err: any, payload: any) => {
        if (err) {
          next();
        } else if (payload) {
          req.user = payload;
          next();
        }
      });
    } else {
      next();
    }
  }
}