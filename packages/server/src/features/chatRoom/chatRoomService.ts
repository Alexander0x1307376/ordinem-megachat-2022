import { DataSource } from "typeorm"
import { ChatRoom } from "../../entity/ChatRoom";


export interface IChatRoomService {
  checkIfRoomExist: (roomUuid: string) => Promise<boolean>;
}

const createChatRoomService = (dataSource: DataSource) => {
  const checkIfRoomExist = async (roomUuid: string) => {
    const result = await dataSource.getRepository(ChatRoom).findOne({
      select: { uuid: true },
      where: {uuid: roomUuid}
    });
    return !!result;
  } 

  const service: IChatRoomService = {
    checkIfRoomExist
  }
  return service;
}

export default createChatRoomService;