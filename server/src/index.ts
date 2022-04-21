import 'reflect-metadata';
import express from 'express'
import router from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import AppDataSource from './dataSource';
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
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(router);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

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


AppDataSource.initialize()
  .then(start)
  .catch(error => console.log(error));

  
// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User";

// AppDataSource.initialize().then(async () => {

//   console.log("Inserting a new user into the database...")
//   const user = new User()
//   user.firstName = "Timber"
//   user.lastName = "Saw"
//   user.age = 25
//   await AppDataSource.manager.save(user)
//   console.log("Saved a new user with id: " + user.id)

//   console.log("Loading users from the database...")
//   const users = await AppDataSource.manager.find(User)
//   console.log("Loaded users: ", users)

//   console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
