import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store/store"; 
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery"; 

export const friendRequestApi = createApi({
  reducerPath: 'friendRequestApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['friendRequestsToMe', 'myFriendRequests'],

  endpoints: build => ({

    friendRequests: build.query<any, void>({
      query: () => ({
        url: 'friend-requests',
        method: 'GET'
      }),
      providesTags: ['friendRequestsToMe', 'myFriendRequests']
    }),

    sendFriendRequest: build.mutation<any, string>({
      query: (requestedUuid) => ({
        url: `friend-request/${requestedUuid}/create`,
        method: 'POST'
      }),
      invalidatesTags: ['myFriendRequests']
    }),

    recallRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/recall`,
        method: 'POST'
      }),
      invalidatesTags: ['myFriendRequests']
    }),

    acceptRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/accept`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequestsToMe']
    }),

    declineRequest: build.mutation<any, string>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/decline`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequestsToMe']
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