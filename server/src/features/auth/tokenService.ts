import {sign} from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserToken } from '../../entity/UserToken';
// import { DateTime } from 'luxon';

const validateToken = (token: string, tokenToValidate: string) => {
  try {
    return verify(token, tokenToValidate);
  }
  catch (error: any) {
    return undefined;
  }
}


  
export const validateAccessToken = (token: string) =>
  validateToken(token, process.env.JWT_ACCESS_SECRET as string);



export const validateRefreshToken = (token: string) =>
  validateToken(token, process.env.JWT_REFRESH_SECRET as string);



export const generateTokens = (payload: any) => {

  // const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
  // const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

  const accessTokenExpiresIn = '20s';
  const refreshTokenExpiresIn = '10d';

  const accessPayload = {
    ...payload,
    // exp: DateTime.now().plus({ minutes: 2 }).toSeconds()
  };

  const refreshPayload = {
    ...payload,
    // exp: DateTime.now().plus({ days: 30 }).toSeconds()
  };

  const accessToken = sign(accessPayload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: accessTokenExpiresIn
  });
  
  const refreshToken = sign(refreshPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: refreshTokenExpiresIn
  });
  
  return {
    accessToken,
    refreshToken
  };
};



export const saveToken = async (userId: number, refreshToken: string) => {

  const tokenRepository = getRepository(UserToken);
  const tokenData = await tokenRepository.findOne({select: ['userId']});
  if(tokenData) {
    tokenData.refreshToken = refreshToken;
    await tokenData.save();
    return tokenData;
  }
  const newToken = UserToken.create({userId, refreshToken}); 
  await newToken.save();
  return newToken;

};



export const removeToken = async (refreshToken: string) => {

  const deletingToken = await UserToken.findOneOrFail({ where: { refreshToken } });
  await deletingToken.remove();
  return deletingToken;

};



export const findToken = async (refreshToken: string) => {

  const token = await UserToken.findOneOrFail({ where: { refreshToken } });
  return token;

};
