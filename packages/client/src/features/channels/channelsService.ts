import { Channel as ChannelItem, ChannelList, ChannelPostData } from "@ordinem-megachat-2022/shared";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../config";
import { RootState } from "../../store/store";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery"; 

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
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
  tagTypes: ['channels'],
  
  endpoints: build => ({

    channelList: build.query<ChannelList, string>({
      query: (groupUuid) => ({
        url: `/channel/${groupUuid}/list`,
        method: 'GET'
      }),
      providesTags: ['channels']
    }),
  
    createChannel: build.mutation<ChannelItem, ChannelPostData>({
      query: body => ({
        url: 'channel/create',
        method: 'POST',
        body
      }),
      invalidatesTags: ['channels']
    }),
  
    updateChannel: build.mutation<ChannelItem, {uuid: string, data: ChannelPostData}>({
      query: ({uuid, data}) => ({
        url: `channel/${uuid}/update`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['channels']
    }),
    
    removeChannel: build.mutation<ChannelItem, string>({
      query: (uuid) => ({
        url: `channel/${uuid}/remove`,
        method: 'DELETE'
      }),
      invalidatesTags: ['channels']
    }),
    
    channelDetails: build.query<ChannelItem, string>({
      query: (uuid) => ({
        url: `channel/${uuid}`,
        method: 'GET'
      }),
      // providesTags: ['channels']
    })
  
  })

});

export const { 
  useChannelDetailsQuery,
  useChannelListQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useRemoveChannelMutation
} = channelsApi;