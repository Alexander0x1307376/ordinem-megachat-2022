import { JwtPayload, sign, verify } from 'jsonwebtoken';
// import AppDataSource from '../../dataSource';
import { UserToken } from '../../entity/UserToken';
import { DataSource } from 'typeorm';


type TokenServiceConfig = {
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}
// const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
// const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

const defaultConfig: TokenServiceConfig = {
  accessTokenExpiresIn: '2m',
  refreshTokenExpiresIn: '10d'
}


export interface ITokenService {
  validateAccessToken: (token: string) => string | JwtPayload | undefined;
  validateRefreshToken: (token: string) => string | JwtPayload | undefined;
  generateTokens: <Payload = any>(payload: Payload) => { accessToken: string; refreshToken: string; };
  saveToken: (userId: number, refreshToken: string) => Promise<UserToken>;
  removeToken: (refreshToken: string) => Promise<UserToken>
}

const createTokenService = ({ dataSource, config = defaultConfig } : { 
  dataSource: DataSource,
  config?: TokenServiceConfig 
}) => {

  const validateToken = (token: string, tokenToValidate: string) => {
    try {
      return verify(token, tokenToValidate);
    }
    catch (error: any) {
      return undefined;
    }
  }

  const validateAccessToken = (token: string) =>
    validateToken(token, process.env.JWT_ACCESS_SECRET as string);

  const validateRefreshToken = (token: string) =>
    validateToken(token, process.env.JWT_REFRESH_SECRET as string);


  const generateTokens = (payload: any) => {

    const { accessTokenExpiresIn, refreshTokenExpiresIn } = config;

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

  const saveToken = async (userId: number, refreshToken: string) => {

    const tokenRepository = dataSource.getRepository(UserToken);
    const tokenData = await tokenRepository.findOne({ where: { userId }, select: ['id', 'userId'] });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
      return tokenData;
    }
    const newToken = dataSource.getRepository(UserToken).create({ userId, refreshToken });
    await newToken.save();
    return newToken;

  };

  const removeToken = async (refreshToken: string) => {

    const deletingToken = await dataSource.getRepository(UserToken).findOneOrFail({ where: { refreshToken } });
    await deletingToken.remove();
    return deletingToken;

  };

  const result: ITokenService = {
    validateAccessToken,
    validateRefreshToken,
    generateTokens,
    saveToken,
    removeToken
  }
  return result;
};

export default createTokenService;