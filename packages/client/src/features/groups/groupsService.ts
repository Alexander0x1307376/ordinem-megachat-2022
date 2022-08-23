import { GroupDetailsResponse, GroupPostData } from "@ordinem-megachat-2022/shared";
import { createApi } from "@reduxjs/toolkit/query/react";
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
  tagTypes: ['userGroups', 'groupDetails'],
  
  endpoints: build => ({

    userGroups: build.query<any, any>({
      query: () => ({
        url: 'group/user-groups',
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

    groupDetails: build.query<GroupDetailsResponse, string>({
      query: (uuid: string) => ({
        url: `group/${uuid}`,
        method: 'GET'
      }),
      providesTags: ['groupDetails']
    }),

    editGroup: build.mutation<any, {uuid: string, data: GroupPostData | any}>({
      query: ({uuid, data}) => ({
        url: `group/${uuid}/update`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['groupDetails']
    })
  
  })

});

export const { 
  useCreateGroupMutation, 
  useEditGroupMutation,
  useUserGroupsQuery, 
  useGroupDetailsQuery
} = groupApi;