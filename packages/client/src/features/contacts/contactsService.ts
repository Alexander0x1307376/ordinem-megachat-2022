import { GroupDetailsResponse, GroupPostData } from "@ordinem-megachat-2022/shared";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../config";
import { RootState } from "../../store/store";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery";

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['userContacts'],

  endpoints: build => ({

    userGroups: build.query<any, any>({
      query: () => ({
        url: 'user-contacts',
        method: 'GET'
      }),
      providesTags: ['userContacts']
    }),

    // createGroup: build.mutation<any, any>({
    //   query: body => ({
    //     url: 'contact/create',
    //     method: 'POST',
    //     body
    //   }),
    //   invalidatesTags: ['userGroups']

    // })

  })

});

export const {

} = contactApi;