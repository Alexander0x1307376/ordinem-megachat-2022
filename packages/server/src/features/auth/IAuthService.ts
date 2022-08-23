import { UserPostData } from '@ordinem-megachat-2022/shared';
import { UserToken } from '../../entity/UserToken';
import {
  LoginResponse,
  RefreshResponse,
  RegistrationResponse
} from '@ordinem-megachat-2022/shared';



export interface IAuthService {
  registration: (userPostData: UserPostData | any) => Promise<RegistrationResponse>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: (refreshToken: string) => Promise<UserToken>;
  refresh: (refreshToken: string) => Promise<RefreshResponse>;
}
