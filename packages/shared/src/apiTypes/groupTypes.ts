
export type GroupDetailsResponse = {
  uuid: string;
  name: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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