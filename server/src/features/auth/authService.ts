import { compare } from 'bcrypt';
import ApiError from '../../exceptions/apiError';
import userService from "../user/userService";
import { UserPostData } from '../user/userTypes';
import * as tokenService from "./tokenService";
import { UserToken } from '../../entity/UserToken';



const generateAndSaveTokens = async (
  userId: number, payload: {uuid: string, name: string}
): Promise<AuthResponse> => {

  const tokens = tokenService.generateTokens({
    uuid: payload.uuid,
    name: payload.name
  });
  await tokenService.saveToken(userId, tokens.refreshToken);

  return {
    userData: {
      uuid: payload.uuid,
      name: payload.name,
    },
    ...tokens
  };

}


export interface AuthResponse {
  userData: {
    uuid: string,
    name: string,
  },
  refreshToken: string,
  accessToken: string
}

export default {

  // регистрация
  registration: async ( {
    email, 
    password, 
    name
  }: UserPostData): Promise<AuthResponse> => {
  
    const isUserExists = await userService.checkExistingByEmail(email);
    if (isUserExists) 
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    

    const user = await userService.create({
      email,
      name,
      password,
    });
    await user.save();


    const authData = await generateAndSaveTokens(user.id, {
      uuid: user.uuid,
      name: user.name
    });

    return authData;
  },



  // логин
  login: async (email: string, password: string)/*: Promise<AuthResponse>*/ => {
    const user = await userService.getAccountData(email);
    
    
    const errorMessage = `Неверный логин или пароль`;
    if(!user) {
      throw ApiError.BadRequest(errorMessage);
    }
    const isPassEquals = await compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(errorMessage);
    }


    const authData = await generateAndSaveTokens(user.id, {
      uuid: user.uuid,
      name: user.name
    });

    return authData;
  },



  // логаут
  logout: async (refreshToken: string) => {
    return await tokenService.removeToken(refreshToken);
  },
  


  // обновление токена
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    
    if (!refreshToken) 
      throw ApiError.UnauthorizedError();
    
    const userData = tokenService.validateRefreshToken(refreshToken) as {uuid: string};
    const tokenFromDb = await UserToken.findOne({ where: { refreshToken } });

    if(!userData || !tokenFromDb) 
      throw ApiError.UnauthorizedError();
    

    const user = await userService.getItem(userData.uuid);

    const authData = await generateAndSaveTokens(user.id, {
      uuid: user.uuid,
      name: user.name
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
} 