import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../../common/IMiddleware';

export class AuthGuard implements IMiddleware {
  execute(req: Request | any, res: Response, next: NextFunction): void {
    if (req.user) {
      return next();
    }
    res.status(401).send({ error: 'Не авторизован' });
  }
}