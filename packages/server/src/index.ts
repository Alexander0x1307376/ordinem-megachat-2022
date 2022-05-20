import 'reflect-metadata';
import express from 'express'
import createRouter from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import AppDataSource from './dataSource';
import { queryParser } from 'express-query-parser';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import CreateMainHandler from './sockets/mainHandler';
import createFriendRequestService from './features/friendshipSystem/friendRequestService';
import createFriendRequestController from './features/friendshipSystem/friendRequestController';
import FriendshipSystemEventEmitter from './features/friendshipSystem/friendshipSystemEventEmitter';
import UsersOnlineStore from './sockets/handlers/UsersOnlineStore';
import createUserService from './features/user/userService';
import createUserController from './features/user/userController';
import createAuthService from './features/auth/authService';
import createAuthController from './features/auth/authController';

export const app = express();

const corsOrigin = process.env.ALLOWED_ORIGIN;
const port = process.env.PORT || 8000;
const webSocketsPort = process.env.WS_PORT || 4000;

const friendshipEventEmitter = new FriendshipSystemEventEmitter();

const userService = createUserService({friendshipEventEmitter});
const userController = createUserController(userService);

const authService = createAuthService(userService);
const authController = createAuthController(authService);


const friendRequestService = createFriendRequestService({
  friendshipEventEmitter
});
const friendRequestController = createFriendRequestController({
  friendRequestService, userService
});


const router = createRouter({
  friendRequestController,
  userController,
  authController
});

// #region Настройка приложения
app.use(cors({
  origin: corsOrigin
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(router);
app.use(errorMiddleware);
// #endregion


// web-socket сервер
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const usersOnlineStore = new UsersOnlineStore();

CreateMainHandler(io, {
  friendshipEventEmitter,
  friendRequestService,
  usersOnlineStore,
  userService
});


const startWebSocketServer = async () => {
  webSocketServer.listen(webSocketsPort, () => {
    console.log(`web socket server is listening on port ${webSocketsPort}`);
  });
}

// запуск api сервера
const startApiServer = async () => {
  app.listen(port, () => {
    console.log(`api server is listening on port ${port}`);
  });
}

// инициализация БД и запуск api-сервера после этого
AppDataSource.initialize()
  .then(startApiServer)
  .then(startWebSocketServer)
  .catch(error => console.log(error));