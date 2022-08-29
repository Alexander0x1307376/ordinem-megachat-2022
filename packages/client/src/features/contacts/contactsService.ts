import { Contacts } from "@ordinem-megachat-2022/shared";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../store/utils/reauthBaseQuery";

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['userContacts'],

  endpoints: build => ({

    userContacts: build.query<Contacts, void>({
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
  useUserContactsQuery
} = contactApi;