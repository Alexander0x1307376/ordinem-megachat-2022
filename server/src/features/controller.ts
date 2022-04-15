import { NextFunction, Request, Response } from "express";

// обёртка, позволяющая не прописывать в каждом методе контроллера блок try-catch для errorMiddleware
export const controllerFunction = <Req extends Request = Request, Res extends Response = Response>(

  callback: (
    req: Req, 
    res: Res, 
    next: NextFunction
  ) => Promise<void> | void

) => async (req: Req, res: Res, next: NextFunction) => {
  try {
    await callback(req, res, next);
  } catch (e) {
    next(e);
  }
}