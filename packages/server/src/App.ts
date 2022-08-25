import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { TYPES } from "./injectableTypes";
import { ILogger } from "./logger/ILogger";
import express, { Express, urlencoded } from 'express';
import { createServer, Server } from 'http';
import { UserController } from "./features/user/UserController";
import { IExeptionFilter } from "./exceptions/IExeptionFilter";
import { UserEventEmitter } from "./features/user/UserEventEmitter";
import { AuthMiddleware } from "./features/auth/AuthMiddleware";
import { ITokenService } from "./features/auth/ITokenService";
import cors from 'cors';
import { json } from 'body-parser';
import { AuthController } from './features/auth/AuthController';
import { IUserController } from './features/user/IUserController';
import { IAuthController } from './features/auth/IAuthController';
import { IChannelController } from './features/channels/IChannelController';
import { IGroupController } from './features/group/IGroupController';
import { IImageController } from './features/image/IImageController';
import { IContactController } from './features/contacts/IContactController';
import { ChannelController } from './features/channels/ChannelController';
import { GroupController } from './features/group/GroupController';
import { ImageController } from './features/image/ImageController';
import { ContactController } from './features/contacts/ContactController';
import { FriendRequestController } from './features/friendshipSystem/FriendRequestController';
import cookieParser from 'cookie-parser';
import { queryParser } from 'express-query-parser';
import path from 'path';
import { DataSource } from 'typeorm';
import { AppDataSource } from './AppDataSource';
import UsersOnlineStore from './features/usersOnlineStore/UsersOnlineStore';
import { Server as SocketServer, Socket } from 'socket.io';
import { WebSocketMainHandler } from './sockets/WebSocketMainHandler';
import { IChatRoomService } from './features/chatRoom/IChatRoomService';
import { IMessageService } from './features/messages/IMessageService';
import { FriendshipSystemEventEmitter } from './features/friendshipSystem/FriendshipSystemEventEmitter';
import { toInteger } from 'lodash';
import { GroupEventEmitter } from './features/group/GroupEventEmitter';
import { ChannelEventEmitter } from './features/channels/ChannelEventEmitter';
import { IConfigService } from './features/config/IConfigService';


// TODO: собрать конфиг где-нибудь в одном месте
const corsOrigin = process.env.ALLOWED_ORIGIN;
// const port = process.env.PORT || 8000;
// const webSocketsPort = toInteger(process.env.WS_PORT) || 4000;

@injectable()
export class App {

  app: Express;
  server: Server;
  port: number;
  webSocketsPort: number;
  
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.DataSource) private dataSource: AppDataSource,
    @inject(TYPES.FriendRequestController) private friendRequestController: FriendRequestController,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.AuthController) private authController: AuthController,
    @inject(TYPES.ChannelController) private channelController: ChannelController,
    @inject(TYPES.GroupController) private groupController: GroupController,
    @inject(TYPES.ImageController) private imageController: ImageController,
    @inject(TYPES.ContactController) private contactController: ContactController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.UsersOnlineStore) private usersOnlineStore: UsersOnlineStore,
    @inject(TYPES.ChatRoomService) private chatRoomService: IChatRoomService,
    @inject(TYPES.MessageService) private messageService: IMessageService,
    @inject(TYPES.FriendshipEventEmitter) private friendshipEventEmitter: FriendshipSystemEventEmitter,
    @inject(TYPES.GroupEventEmitter) private groupEventEmitter: GroupEventEmitter,
    @inject(TYPES.ChannelEventEmitter) private channelEventEmitter: ChannelEventEmitter

  ) {
    this.app = express();
    this.port = toInteger(this.configService.get('PORT'));    
    this.webSocketsPort = toInteger(this.configService.get('WS_PORT'));     
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
    this.app.use('/group', this.groupController.router);
    this.app.use('/channel', this.channelController.router);
    this.app.use('/image', this.imageController.router);
    this.app.use('/user-contacts', this.contactController.router);
    this.app.use('/friend-request', this.friendRequestController.router);
    this.app.use('/', this.authController.router);
  }

  useMiddleware() {
    this.app.use(cors({
      origin: corsOrigin
    }));
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(queryParser({
      parseNull: true,
      parseUndefined: true,
      parseBoolean: true,
      parseNumber: true
    }));
    const authMiddleware = new AuthMiddleware(this.tokenService);
    this.app.use(authMiddleware.execute.bind(authMiddleware));
    this.app.use('/images', express.static(path.join(__dirname, '../images')));
  }

  useExeptionFilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useMiddleware();
    this.useRoutes();
    this.useExeptionFilters();


    // web-socket сервер
    const webSocketServer = createServer(this.app);
    const io = new SocketServer(webSocketServer, {
      cors: {
        credentials: true,
        origin: corsOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });


    const wcHandler = new WebSocketMainHandler(
      io, 
      this.usersOnlineStore, 
      this.logger, 
      this.chatRoomService, 
      this.messageService, 
      this.friendshipEventEmitter,
      this.groupEventEmitter,
      this.channelEventEmitter
    );
    wcHandler.init();

    await this.dataSource.dataSource.initialize();

    this.app.listen(this.port, () => {
      this.logger.log(`API сервер запущен на http://localhost:${this.port}`);
    });
    webSocketServer.listen(this.webSocketsPort, () => {
      this.logger.log(`Web-socket сервер запущен на http://localhost:${this.webSocketsPort}`);
    });

  }
}