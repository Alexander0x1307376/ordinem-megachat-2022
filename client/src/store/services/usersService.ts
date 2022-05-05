import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../config";
import { RootState } from "../store";
import { baseQueryWithReauth } from "../utils/reauthBaseQuery";

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['userSearch', 'friends'],

  endpoints: build => ({

    userSearch: build.query<any, any>({
      query: (search) => ({
        url: 'users/search',
        method: 'GET',
        params: {
          search
        }
      }),
      providesTags: ['userSearch']
    }),


    // friends: build.query<any, any>({
    //   query: () => ({
    //     url: ''
    //   })
    // })

  })

});

export const { useUserSearchQuery, useLazyUserSearchQuery } = userApi;