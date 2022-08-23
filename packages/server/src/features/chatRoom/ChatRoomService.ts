import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { DataSource, Repository } from "typeorm";
import { ChatRoom } from "../../entity/ChatRoom";
import { TYPES } from "../../injectableTypes";
import { IChatRoomService } from "./IChatRoomService";
import { AppDataSource } from '../../AppDataSource'; 

@injectable()
export class ChatRoomService implements IChatRoomService {

  private chatRoomRepository: Repository<ChatRoom>;
  private dataSource: DataSource;

  constructor(
    @inject(TYPES.DataSource) dataSource: AppDataSource
  ){
    this.dataSource = dataSource.dataSource;
    this.chatRoomRepository = this.dataSource.getRepository(ChatRoom);

    this.checkIfRoomExist = this.checkIfRoomExist.bind(this);
  }

  async checkIfRoomExist(roomUuid: string) {
    const result = await this.chatRoomRepository.findOne({
      select: { uuid: true },
      where: { uuid: roomUuid }
    });
    return !!result;
  }
}