

export interface IChatRoomService {
  checkIfRoomExist: (roomUuid: string) => Promise<boolean>;
}
