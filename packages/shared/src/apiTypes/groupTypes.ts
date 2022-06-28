
export type Group = {
  uuid: string; 
  name: string;
  avaUrl?: string;
  description: string;
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
  description: string;
  createdAt: number;
  updatedAt: number;
  owner: {
    uuid: string;
    name: string;
  };
}

export type JoinGroupResponse = {

}

export type LeaveGroupResponse = {

}

export type GroupCreatePostData = {

}

export type GroupEditPostData = {

}