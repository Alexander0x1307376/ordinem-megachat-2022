import { User } from "./userTypes";

export type FriendRequest = {
  uuid: string;
  requester: User;
  requested: User;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestsInfo = {
  friendRequests: {
    outcomingRequests: FriendRequest[];
    incomingRequests: FriendRequest[];
  };
  friendsStatuses: Record<string, {status: string}>;
}

export type FriendRequestUuids = {
  uuid: string;
  requesterUuid: string;
  requestedUuid: string;
}