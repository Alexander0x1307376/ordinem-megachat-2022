import {
  RequestsInfo,
  FriendRequestUuids,
  FriendRequestMessage
} from '@ordinem-megachat-2022/shared';





export interface IFriendRequestService {
  createRequest: (
    requesterUuid: string, requestedName: string
  ) => Promise<FriendRequestMessage>;
  recallRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  acceptRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  declineRequest: (userUuid: string, requestUuid: string) => Promise<FriendRequestUuids>;
  getRequests: (userUuid: string) => Promise<RequestsInfo>;
}
