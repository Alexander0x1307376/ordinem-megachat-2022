import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { DataSource, Repository } from "typeorm";
import { UserToken } from "../../entity/UserToken";
import { TYPES } from "../../injectableTypes";
import { ITokenService } from "./ITokenService";
import { sign, verify } from 'jsonwebtoken';
import { AppDataSource } from '../../AppDataSource'; 

type TokenServiceConfig = {
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
};


@injectable()
export class TokenService implements ITokenService {
  
  private tokenRepository: Repository<UserToken>;
  private dataSource: DataSource;


  // TODO: вынести конфиг в правильное место
  config: TokenServiceConfig = {
    accessTokenExpiresIn: '2m',
    refreshTokenExpiresIn: '10d'
  };

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ) {
    this.dataSource = dataSource.dataSource;
    this.tokenRepository = this.dataSource.getRepository(UserToken);
  }

  validateToken(token: string, tokenToValidate: string) {
    try {
      return verify(token, tokenToValidate);
    }
    catch (error: any) {
      return undefined;
    }
  }

  validateAccessToken(token: string) {
    return this.validateToken(token, process.env.JWT_ACCESS_SECRET as string);
  }

  validateRefreshToken(token: string) {
    return this.validateToken(token, process.env.JWT_REFRESH_SECRET as string);
  }


  generateTokens(payload: any) {

    const { accessTokenExpiresIn, refreshTokenExpiresIn } = this.config;

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

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({ where: { userId }, select: ['id', 'userId'] });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
      return tokenData;
    }
    const newToken = this.tokenRepository.create({ userId, refreshToken });
    await newToken.save();
    return newToken;
  };

  async removeToken(refreshToken: string) {

    const deletingToken = await this.tokenRepository.findOneOrFail({ where: { refreshToken } });
    await deletingToken.remove();
    return deletingToken;

  };
}