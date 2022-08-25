import 'reflect-metadata';
import { Container, ContainerModule, decorate, injectable, interfaces } from 'inversify';
import { App } from './App';
import { ExeptionFilter } from './exceptions/ExeptionFilter';
import { IExeptionFilter } from './exceptions/IExeptionFilter';
import { AuthController } from './features/auth/AuthController';
import { AuthService } from './features/auth/AuthService';
import { IAuthController } from './features/auth/IAuthController';
import { IAuthService } from './features/auth/IAuthService';
import { IUserController } from './features/user/IUserController';
import { IUserService } from './features/user/IUserService';
import { UserController } from './features/user/UserController';
import { UserEventEmitter } from './features/user/UserEventEmitter';
import { UserService } from './features/user/UserService';
import { TYPES } from './injectableTypes';
import { ILogger } from './logger/ILogger';
import { LoggerService } from './logger/loggerService';
import { IChatRoomService } from './features/chatRoom/IChatRoomService';
import { ChatRoomService } from './features/chatRoom/ChatRoomService';
import { IChannelController } from './features/channels/IChannelController';
import { ChannelController } from './features/channels/ChannelController';
import { ChannelService } from './features/channels/ChannelService';
import { IChannelService } from './features/channels/IChannelService';
import { ChannelEventEmitter } from './features/channels/ChannelEventEmitter';
import { IImageController } from './features/image/IImageController';
import { ImageController } from './features/image/ImageController';
import { ImageService } from './features/image/ImageService';
import { IImageService } from './features/image/IImageService';
import { IGroupController } from './features/group/IGroupController';
import { GroupController } from './features/group/GroupController';
import { GroupService } from './features/group/GroupService';
import { IGroupService } from './features/group/IGroupService';
import { GroupEventEmitter } from './features/group/GroupEventEmitter';
import { IMessageService } from './features/messages/IMessageService';
import { MessageService } from './features/messages/MessageService';
import { ITokenService } from './features/auth/ITokenService';
import { TokenService } from './features/auth/TokenService';
import { IFriendRequestController } from './features/friendshipSystem/IFriendRequestController';
import { FriendRequestController } from './features/friendshipSystem/FriendRequestController';
import { FriendRequestService } from './features/friendshipSystem/FriendRequestService';
import { IFriendRequestService } from './features/friendshipSystem/IFriendRequestService';
import { FriendshipSystemEventEmitter } from './features/friendshipSystem/FriendshipSystemEventEmitter';
import { IContactController } from './features/contacts/IContactController';
import { ContactController } from './features/contacts/ContactController';
import { IContactService } from './features/contacts/IContactService';
import { ContactService } from './features/contacts/ContactService';
import { AppDataSource } from './AppDataSource';
import { EventEmitter } from 'events';
import UsersOnlineStore from './features/usersOnlineStore/UsersOnlineStore';
import { IConfigService } from './features/config/IConfigService';
import { ConfigService } from './features/config/ConfigService';
// decorate(injectable(), EventEmitter);
export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<AppDataSource>(TYPES.DataSource).to(AppDataSource).inSingletonScope();
  
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);

  bind<IAuthController>(TYPES.AuthController).to(AuthController);
  bind<IAuthService>(TYPES.AuthService).to(AuthService);

  bind<IChatRoomService>(TYPES.ChatRoomService).to(ChatRoomService);
  
  bind<IChannelController>(TYPES.ChannelController).to(ChannelController);
  bind<IChannelService>(TYPES.ChannelService).to(ChannelService);
  bind<ChannelEventEmitter>(TYPES.ChannelEventEmitter).to(ChannelEventEmitter).inSingletonScope();
  
  bind<IImageController>(TYPES.ImageController).to(ImageController);
  bind<IImageService>(TYPES.ImageService).to(ImageService);
  
  bind<IGroupController>(TYPES.GroupController).to(GroupController);
  bind<IGroupService>(TYPES.GroupService).to(GroupService);
  bind<GroupEventEmitter>(TYPES.GroupEventEmitter).to(GroupEventEmitter).inSingletonScope();

  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<UserEventEmitter>(TYPES.UserEventEmitter).to(UserEventEmitter).inSingletonScope();

  bind<IMessageService>(TYPES.MessageService).to(MessageService);

  bind<ITokenService>(TYPES.TokenService).to(TokenService);

  bind<IFriendRequestController>(TYPES.FriendRequestController).to(FriendRequestController);
  bind<IFriendRequestService>(TYPES.FriendRequestService).to(FriendRequestService);
  bind<FriendshipSystemEventEmitter>(TYPES.FriendshipEventEmitter).to(FriendshipSystemEventEmitter).inSingletonScope();
  
  bind<IContactController>(TYPES.ContactController).to(ContactController);
  bind<IContactService>(TYPES.ContactService).to(ContactService);

  bind<UsersOnlineStore>(TYPES.UsersOnlineStore).to(UsersOnlineStore);

  bind<App>(TYPES.Application).to(App);

});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container({
    skipBaseClassChecks: true
  });
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return {appContainer, app};
}

export const boot = bootstrap();