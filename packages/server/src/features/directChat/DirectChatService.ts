import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DataSource } from "typeorm";
import { TYPES } from '../../injectableTypes';
import { IDirectChatService } from "./IDirectChatService";
import { AppDataSource } from '../../AppDataSource'; 


// TODO: дописать
@injectable()
export class DirectChatService implements IDirectChatService {
  private dataSource: DataSource;
  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ) {
    this.dataSource = dataSource.dataSource;
  }
}