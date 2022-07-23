import { User } from "@ordinem-megachat-2022/shared";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['userSearch', 'friends', 'groupMembers'],

  endpoints: build => ({

    groupMembers: build.query<User[], string>({
      query: (groupUuid) => ({
        url: `/users/${groupUuid}/members`,
        method: 'GET'
      }),
      providesTags: ['groupMembers']
    }),


    userSearch: build.query<User[], string>({
      query: (search) => ({
        url: 'users/search',
        method: 'GET',
        params: {
          search
        }
      }),
      providesTags: ['userSearch']
    }),


    friends: build.query<User[], void>({
      query: () => ({
        url: 'users/friends',
        method: 'GET'
      }),
      providesTags: ['friends']
    }),
    
    
    removeFriend: build.mutation<any, any>({
      query: (friendUuid: string) => ({
        url: `users/friend/${friendUuid}/remove`,
        method: 'POST'
      }),
      invalidatesTags: ['friends']
    })

  })

});

export const { 
  useUserSearchQuery, 
  useLazyUserSearchQuery, 
  useFriendsQuery,
  useRemoveFriendMutation,
  useGroupMembersQuery
} = userApi;

export default userApi;