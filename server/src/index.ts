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
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
io.on('connection', (socket) => socketServer(io, socket));

// запуск api сервера
const start = async () => {
  try {
    app.listen(port, () => {
      console.clear();
      console.log(`server is listening on port ${port}`)
    });
  }
  catch (error) {
    console.error(error);
  }
}

// инициализация БД и запуск api-сервера после этого
AppDataSource.initialize()
  .then(start)
  .catch(error => console.log(error));