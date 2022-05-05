import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { baseQueryWithReauth } from "../utils/reauthBaseQuery";

export const friendRequestApi = createApi({
  reducerPath: 'friendRequestApi',
  baseQuery: baseQueryWithReauth,
  // baseQuery: fetchBaseQuery({
  //   baseUrl: BASE_API_URL,
  //   prepareHeaders: (headers, { getState }) => {
  //     const token = (getState() as RootState).auth.accessToken;
  //     if (token) {
  //       headers.set('authorization', `Bearer ${token}`);
  //     }
  //     return headers;
  //   },
  // }),
  tagTypes: ['friendRequestsToMe', 'myFriendRequests'],

  endpoints: build => ({

    friendRequests: build.query<any, any>({
      query: () => ({
        url: 'friend-requests',
        method: 'GET'
      }),
      providesTags: ['friendRequestsToMe', 'myFriendRequests']
    }),

    sendFriendRequest: build.mutation<any, any>({
      query: (requestedUuid) => ({
        url: `friend-request/${requestedUuid}/create`,
        method: 'POST'
      }),
      invalidatesTags: ['myFriendRequests']
    }),

    recallRequest: build.mutation<any, any>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/recall`,
        method: 'POST'
      }),
      invalidatesTags: ['myFriendRequests']
    }),

    acceptRequest: build.mutation<any, any>({
      query: (requestUuid) => ({
        url: `friend-request/${requestUuid}/accept`,
        method: 'POST'
      }),
      invalidatesTags: ['friendRequestsToMe']
    }),

    declineRequest: build.mutation<any, any>({
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