import { User } from "./userTypes";

export type FriendRequest = {
  uuid: string;
  requester: User;
  requested: User;
  createdAt: string;
  updatedAt: string;
}

export type FriendRequestMessage = {
  status: 'success' | 'counterRequest' | 'alreadyFriends' | 'noRequestedUser' | 'toSelf';
  data: {
    requester: {
      uuid: string;
    },
    requested: {
      uuid?: string;
      name: string;
    }
  };
}

export type FriendRequestResponse = FriendRequest | FriendRequestMessage;

export type RequestsInfo = {
  outcomingRequests: FriendRequest[];
  incomingRequests: FriendRequest[];
}

export type FriendRequestUuids = {
  uuid: string;
  requesterUuid: string;
  requestedUuid: string;
}