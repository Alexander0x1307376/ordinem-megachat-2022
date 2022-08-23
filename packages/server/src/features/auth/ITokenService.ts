import { JwtPayload } from 'jsonwebtoken';
import { UserToken } from '../../entity/UserToken';



export interface ITokenService {
  validateAccessToken: (token: string) => string | JwtPayload | undefined;
  validateRefreshToken: (token: string) => string | JwtPayload | undefined;
  generateTokens: <Payload = any>(payload: Payload) => { accessToken: string; refreshToken: string; };
  saveToken: (userId: number, refreshToken: string) => Promise<UserToken>;
  removeToken: (refreshToken: string) => Promise<UserToken>;
}
