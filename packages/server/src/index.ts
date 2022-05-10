import 'reflect-metadata';
import express from 'express'
import router from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import AppDataSource from './dataSource';
import { queryParser } from 'express-query-parser';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketServer from './sockets/socketServer';

export const app = express();

const corsOrigin = process.env.ALLOWED_ORIGIN;
const port = process.env.PORT || 8000;
const webSocketsPort = process.env.WS_PORT || 4000;

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



// web-socket сервер
const webSocketServer = createServer(app);
const io = new Server(webSocketServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
io.on('connection', (socket) => socketServer(io, socket));


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