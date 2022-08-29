import 'reflect-metadata';
import { AuthResponse, LoginResponse, RefreshResponse, RegistrationResponse, UserPostData } from "@ordinem-megachat-2022/shared";
import { compare } from "bcrypt";
import { inject, injectable } from "inversify";
import { DataSource, Repository } from "typeorm";
import { Image } from "../../entity/Image";
import { UserToken } from "../../entity/UserToken";
import ApiError from "../../exceptions/apiError";
import { TYPES } from "../../injectableTypes";
import { IImageService } from "../image/IImageService";
import { IUserService } from "../user/IUserService";
import { IAuthService } from "./IAuthService";
import { ITokenService } from "./ITokenService";
import { AppDataSource } from '../../AppDataSource';

@injectable()
export class AuthService implements IAuthService {

  private imageRepository: Repository<Image>;
  private tokenRepository: Repository<UserToken>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ImageService) private imageService: IImageService
  ) { 
    this.dataSource = dataSource.dataSource;
    this.imageRepository = this.dataSource.getRepository(Image);
    this.tokenRepository = this.dataSource.getRepository(UserToken);

    
  }

  async generateAndSaveTokens(
    userId: number, payload: any
  ): Promise<AuthResponse> {

    const tokens = this.tokenService.generateTokens(payload);
    await this.tokenService.saveToken(userId, tokens.refreshToken);

    return {
      userData: payload,
      ...tokens
    };
  }

  async registration({
    email,
    password,
    name,
    imageData
  }: UserPostData | any): Promise<RegistrationResponse> {

    const isUserExists = await this.userService.checkExistingByEmail(email);
    if (isUserExists)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);


    let image;
    if (imageData)
      image = await this.imageService.create(imageData);


    const user = await this.userService.create({
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

    const authData = await this.generateAndSaveTokens(user.id, tokenPayload);

    return authData;
  }




  async login(email: string, password: string): Promise<LoginResponse> {

    const user = await this.userService.getAccountData(email);
    
    const errorMessage = `Неверный логин или пароль`;
    if (!user) {
      throw ApiError.BadRequest(errorMessage);
    }

    const isPassEquals = await compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(errorMessage);
    }

    let avatar;
    if (user.avaId)
      avatar = await this.imageRepository.findOne({ where: { id: user.avaId } });


    const authData = await this.generateAndSaveTokens(user.id, {
      uuid: user.uuid,
      name: user.name,
      avaUrl: avatar?.path
    });

    return authData;
  }



  // логаут
  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }



  // обновление токена
  async refresh(refreshToken: string): Promise<RefreshResponse> {

    if (!refreshToken)
      throw ApiError.UnauthorizedError();

    const userData = this.tokenService.validateRefreshToken(refreshToken) as { uuid: string };
    const tokenFromDb = await this.tokenRepository.findOne({ where: { refreshToken } });

    if (!userData || !tokenFromDb)
      throw ApiError.UnauthorizedError();


    const user = await this.userService.getItem(userData.uuid);
    let avatar;
    if (user.avaId)
      avatar = await Image.findOne({ where: { id: user.avaId } });


    const authData = await this.generateAndSaveTokens(user.id, {
      uuid: user.uuid,
      name: user.name,
      avaUrl: avatar?.path
    });

    return authData;
  }

}