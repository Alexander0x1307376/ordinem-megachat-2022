import { compare } from 'bcrypt';
import ApiError from '../../exceptions/apiError';
import userService from "../user/userService";
import { UserPostData } from '../user/userTypes';
import * as tokenService from "./tokenService";
import { UserToken } from '../../entity/UserToken';
import imageService from '../image/imageService';
import { Image } from '../../entity/Image';



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


export interface AuthResponse {
  userData: {
    uuid: string;
    name: string;
    avaUrl?: string;
  },
  refreshToken: string;
  accessToken: string;
}

export default {

  // регистрация
  registration: async ( {
    email, 
    password, 
    name,
    imageData
  }: UserPostData | any): Promise<AuthResponse> => {
  
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

    const avatar = await Image.findOne({where: {id: user.avaId}});

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