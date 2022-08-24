import { FriendRequestMessage, FriendRequestResponse, RequestsInfo } from "@ordinem-megachat-2022/shared";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store"; 
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery"; 

export const friendRequestApi = createApi({
  reducerPath: 'friendRequestApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['friendRequests'],

  endpoints: build => ({

    friendRequests: build.query<RequestsInfo, void>({
      query: () => ({
        url: 'friend-request',
        method: 'GET'
      }),
      providesTags: ['friendRequests']
    }),

    sendFriendRequest: build.mutation<FriendRequestMessage, string>({
      query: (requestedName) => ({
        url: `friend-request/create`,
        method: 'POST',
        body: { requestedName }
      }),
      invalidatesTags: ['friendRequests']
    }),

    recallRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/recall`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequests']
    }),

    acceptRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/accept`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequests']
    }),

    declineRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/decline`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequests']
    }),



  })

});

export const { 
  useSendFriendRequestMutation,
  useRecallRequestMutation, 
  useFriendRequestsQuery,
  useAcceptRequestMutation,
  useDeclineRequestMutation
} = friendRequestApi;

export default friendRequestApi;