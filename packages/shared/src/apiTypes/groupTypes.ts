import { Channel } from "./channelTypes";
import { ImagePostData } from "./imageTypes";
import { User } from "./userTypes";

export type Group = {
  uuid: string; 
  name: string;
  avaUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUuid: string;
}

export type UserGroupsResponse = {
  groupsWhereMember: Group[];
  groupsWhereOwner: Group[];
}

export type GroupDetailsResponse = {
  uuid: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  avaPath?: string;
  avaUuid?: string;
  owner: User;
  channels: Channel[];
}

export type GroupResponse = {
  uuid: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerUuid: string;
  avaPath?: string;
  avaUuid?: string;
}

export type JoinGroupResponse = {

}

export type LeaveGroupResponse = {

}


export type GroupPostData = {
  name: string;
  description: string;
  avaUuid?: string;
}

export type FullGroupPostData = GroupPostData & { ownerUuid: string };
