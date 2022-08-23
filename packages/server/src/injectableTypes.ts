export const TYPES = {

  Application: Symbol.for('Application'),


  ConfigService: Symbol.for('ConfigService'),
  
  DataSource: Symbol.for('DataSource'),
  
  ILogger: Symbol.for('ILogger'),
  ExeptionFilter: Symbol.for('ExeptionFilter'),

  AuthController: Symbol.for('AuthController'),
  AuthService: Symbol.for('AuthService'),

  ChatRoomService: Symbol.for('ChatRoomService'),
  
  ChannelController: Symbol.for('ChannelController'),
  ChannelService: Symbol.for('ChannelService'),
  ChannelEventEmitter: Symbol.for('ChannelEventEmitter'),

  ImageController: Symbol.for('ImageController'),
  ImageService: Symbol.for('ImageService'),
  
  GroupController: Symbol.for('GroupController'),
  GroupService: Symbol.for('GroupService'),
  GroupEventEmitter: Symbol.for('GroupEventEmitter'),

  UserController: Symbol.for('UserController'),
  UserService: Symbol.for('UserService'),
  UserEventEmitter: Symbol.for('UserEventEmitter'),
  
  MessageService: Symbol.for('MessageService'),

  TokenService: Symbol.for('TokenService'),

  FriendRequestController: Symbol.for('FriendRequestController'),
  FriendRequestService: Symbol.for('FriendRequestService'),
  FriendshipEventEmitter: Symbol.for('FriendshipEventEmitter'),

  ContactController: Symbol.for('ContactController'),
  ContactService: Symbol.for('ContactService'),

  UsersOnlineStore: Symbol.for('UsersOnlineStore'),
  SocketServer: Symbol.for('SocketServer'),
}