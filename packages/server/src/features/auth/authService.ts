import { compare } from 'bcrypt';
import ApiError from '../../exceptions/apiError';
import userService, { IUserService } from "../user/userService";
import { UserPostData } from '@ordinem-megachat-2022/shared';
import * as tokenService from "./tokenService";
import { UserToken } from '../../entity/UserToken';
import imageService from '../image/imageService';
import { Image } from '../../entity/Image';

import {
  AuthResponse,
  LoginResponse,
  RefreshResponse,
  RegistrationResponse,
  LoginPostData,
  RegistrationPostData
} from '@ordinem-megachat-2022/shared';


export interface IAuthService {
  registration: (userPostData: UserPostData | any) => Promise<RegistrationResponse>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: (refreshToken: string) => Promise<UserToken>;
  refresh: (refreshToken: string) => Promise<RefreshResponse>;
}

const createAuthService = (userService: IUserService) => {

  const generateAndSaveTokens = async (
    userId: number, payload: any
  ): Promise<AuthResponse> => {

    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(userId, tokens.refreshToken);

    return {
      userData: payload,
      ...tokens
    };

  }

  return {

    // регистрация
    registration: async ({
      email,
      password,
      name,
      imageData
    }: UserPostData | any): Promise<RegistrationResponse> => {

      const isUserExists = await userService.checkExistingByEmail(email);
      if (isUserExists)
        throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);


      let image;
      if (imageData)
        image = await imageService.create(imageData);


      const user = await userService.create({
        email,
        name,
        password,
        avaId: image?.id
      });
      await user.save();


      const tokenPayload = {
        uuid: user.uuid,
        name: user.name,
        avaUrl: image?.path
      };

      const authData = await generateAndSaveTokens(user.id, tokenPayload);

      return authData;
    },



    // логин
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const user = await userService.getAccountData(email);


      const errorMessage = `Неверный логин или пароль`;
      if (!user) {
        throw ApiError.BadRequest(errorMessage);
      }

      const isPassEquals = await compare(password, user.password);
      if (!isPassEquals) {
        throw ApiError.BadRequest(errorMessage);
      }
      
      let avatar;
      if(user.avaId)
        avatar = await Image.findOne({ where: { id: user.avaId } });
      

      const authData = await generateAndSaveTokens(user.id, {
        uuid: user.uuid,
        name: user.name,
        avaUrl: avatar?.path
      });

      return authData;
    },



    // логаут
    logout: async (refreshToken: string) => {
      return await tokenService.removeToken(refreshToken);
    },



    // обновление токена
    refresh: async (refreshToken: string): Promise<RefreshResponse> => {

      if (!refreshToken)
        throw ApiError.UnauthorizedError();

      const userData = tokenService.validateRefreshToken(refreshToken) as { uuid: string };
      const tokenFromDb = await UserToken.findOne({ where: { refreshToken } });

      if (!userData || !tokenFromDb)
        throw ApiError.UnauthorizedError();


      const user = await userService.getItem(userData.uuid);
      let avatar;
      if (user.avaId)
        avatar = await Image.findOne({ where: { id: user.avaId } });


      const authData = await generateAndSaveTokens(user.id, {
        uuid: user.uuid,
        name: user.name,
        avaUrl: avatar?.path
      });

      return authData;
    },


    // // активация при переходе по ссылке
    // activate: async (link: string) => {
    //   const user = await userService.findByActivationLink(link);
    //   if(!user) {
    //     throw ApiError.BadRequest('Некорректная ссылка активации');
    //   }
    //   await userService.setActivated(user.uuid);
    // },
  } as IAuthService;
}

export default createAuthService;