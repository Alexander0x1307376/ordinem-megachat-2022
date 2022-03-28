import 'reflect-metadata';
import express from 'express'
import router from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import dataSource from './dataSource';
import { queryParser } from 'express-query-parser';
import path from 'path';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(router);
app.use(errorMiddleware);


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


dataSource.initialize()
  .then(start);

const port = process.env.PORT || 8000;

console.log(port);