import { Request, Response, NextFunction } from 'express';
import ApiError from '../../exceptions/apiError';
import { ITokenService } from './tokenService';

const createAuthMiddleware = (tokenService: ITokenService) => 
  (req: Request | any, res: Response, next: NextFunction) => {
    try {

      const authHeader = req.headers.authorization;
      if(!authHeader)
        return next(ApiError.UnauthorizedError());
        
      const accessToken = authHeader.split(' ')[1]; // потрошим Bearer token
      if(!accessToken)
        return next(ApiError.UnauthorizedError());

      const userData = tokenService.validateAccessToken(accessToken);
      if(!userData)
        return next(ApiError.UnauthorizedError());

      req.user = userData;
      next();
    } 
    catch (error: any) {
      return next(ApiError.UnauthorizedError());
    }
  };

export default createAuthMiddleware;