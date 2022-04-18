import { sign, verify } from 'jsonwebtoken';
import AppDataSource from '../../dataSource';
import { UserToken } from '../../entity/UserToken';

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

  const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
  const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
  // const accessTokenExpiresIn = '20s';
  // const refreshTokenExpiresIn = '10d';

  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;

  const accessToken = sign(payload, accessSecret, {
    expiresIn: accessTokenExpiresIn
  });
  
  const refreshToken = sign(payload, refreshSecret, {
    expiresIn: refreshTokenExpiresIn
  });
  
  return {
    accessToken,
    refreshToken
  };
};



export const saveToken = async (userId: number, refreshToken: string) => {

  const tokenRepository = AppDataSource.getRepository(UserToken);
  const tokenData = await tokenRepository.findOne({where: {userId}, select: ['id', 'userId']});
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
