import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../config";
import { RootState } from "../../store/store";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery";

export const groupApi = createApi({
  reducerPath: 'groupApi',
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
  tagTypes: ['userGroups'],
  
  endpoints: build => ({

    userGroups: build.query<any, any>({
      query: () => ({
        url: 'user-groups',
        method: 'GET'
      }),
      providesTags: ['userGroups']
    }),
  
    createGroup: build.mutation<any, any>({
      query: body => ({
        url: 'group/create',
        method: 'POST',
        body
      }),
      invalidatesTags: ['userGroups']

    }),

    groupDetails: build.query<any, any>({
      query: (uuid: string) => ({
        url: `group/${uuid}`,
        method: 'GET'
      })
    })
  
  })

});

export const { 
  useCreateGroupMutation, 
  useUserGroupsQuery, 
  useGroupDetailsQuery
} = groupApi;