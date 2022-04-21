import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/apiError';

export default (err: any | ApiError, req: Request, res: Response, next: NextFunction) => {
  // console.log(err.message);
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  else {
    res.status(500).json({ message: 'Непредвиденная ошибка' })
  }
}