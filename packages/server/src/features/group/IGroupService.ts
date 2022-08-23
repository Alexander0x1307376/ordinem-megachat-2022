import { GroupDetailsResponse, GroupResponse } from "@ordinem-megachat-2022/shared";
import { ChangeDataEventEmitter } from "../crudService/changeDataEventEmitter";
import { FullGroupPostData } from "@ordinem-megachat-2022/shared";



// export interface IGroupService extends ChangeDataEventEmitter<GroupResponse> {
export interface IGroupService {
  userGroups: (userUuid: string) => Promise<any>;
  groupDetails: (groupUuid: string) => Promise<GroupDetailsResponse>;
  createInvite: (inviterUuid: string, groupUuid: string) => Promise<any>;
  joinGroup: (userUuid: string, linkId: string) => Promise<any>;
  leaveGroup: (userUuid: string, groupUuid: string) => Promise<any>;
  create: (groupData: FullGroupPostData) => Promise<GroupResponse>;
  update: (groupUuid: string, groupData: FullGroupPostData) => Promise<GroupResponse>;
}
