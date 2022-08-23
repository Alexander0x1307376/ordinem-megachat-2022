import { User } from "../../entity/User";
import { PaginationData } from "../../utils/serviceUtils";
import { UserPostData, User as UserItem } from "@ordinem-megachat-2022/shared";
import { DeleteResult } from "typeorm";
import { ChangeDataEventEmitter } from "../crudService/changeDataEventEmitter";


// export interface IUserService extends ChangeDataEventEmitter<any> {
export interface IUserService {
  getItem: (userUuid: string) => Promise<User>;
  getList: (page: number, rowsPerPage?: number) => Promise<PaginationData<User>>;
  checkExistingByEmail: (email: string) => Promise<boolean>;
  getAccountData: (email: string) => Promise<User | null>;
  create: (data: UserPostData) => Promise<User>;
  searchByName: (currentUserUuid: string, search: string) => Promise<UserItem[]>;
  friends: (userUuid: string) => Promise<UserItem[]>;
  removeFriend: (currentUserUuid: string, friendUuid: string) => Promise<DeleteResult>;
  groupMembers: (groupUuid: string) => Promise<UserItem[]>;
}
