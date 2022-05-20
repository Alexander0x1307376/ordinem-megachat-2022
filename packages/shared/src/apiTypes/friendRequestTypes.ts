import { User } from "./userTypes";

export type FriendRequest = {
  uuid: string;
  requester: User;
  requested: User;
  createdAt: string | Date;
  updatedAt: string | Date;
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