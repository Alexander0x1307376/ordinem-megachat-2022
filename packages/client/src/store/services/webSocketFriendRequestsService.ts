import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { io } from "socket.io-client";
import { SERVER_URI } from "src/config";
import { getUserFromLocalStorage } from "src/utils/authUtils";
import { RootState } from "../store";
import { baseQueryWithReauth } from "../utils/reauthBaseQuery";
import { MessageSystemEvents as msEvents } from '@webSocketMessages/messageSystemEvents';


export const friendRequestApi = createApi({
  reducerPath: 'friendRequestApi',
  // baseQuery: baseQueryWithReauth,
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URI
  }),
  tagTypes: ['friendRequestsToMe', 'myFriendRequests'],

  endpoints: build => ({

    // friendRequests: build.query<RequestsInfo, void>({
    friendRequests: build.query<any, void>({
      queryFn: () => ({data: {requestsToUser: [], userRequests: []}}),
      onCacheEntryAdded: async (id, {cacheDataLoaded, cacheEntryRemoved, updateCachedData}) => {
        await cacheDataLoaded;

        const user = getUserFromLocalStorage();
        if (!user) { return; }
        const handshake = { ...user.userData, accessToken: user.accessToken };

        const socket = io(SERVER_URI, { withCredentials: true, query: handshake });
        socket.on('connect', () => {
          // socket.emit(Atata.ATATA);
        });

        // socket.on(msEvents.REQUEST_INFO_IS_SENT, (requestsInfo: RequestsInfo) => {
        //   updateCachedData((data) => {
        //     Object.assign(data, requestsInfo);
        //   });
        // })


      }
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