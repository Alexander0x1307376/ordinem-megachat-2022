import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../config";
import { clearUserData, getUserFromLocalStorage, setUserData } from "../../utils/authUtils";
import { clearUser, setUser, UserState } from "./authSlice";
import { RootState } from "../../store/store";
import { 
  LoginResponse, 
  LoginPostData, 
  RegistrationPostData,
  RefreshResponse 
} from '@ordinem-megachat-2022/shared/src/apiTypes/authTypes';


export const authApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['LoginData'],

  endpoints: build => ({

    registration: build.mutation<RefreshResponse, RegistrationPostData>({
      query: body => ({
        url: 'registration',
        method: 'POST',
        body
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        setUserData(data);
        dispatch(setUser(data));
      }
    }),

    login: build.mutation<LoginResponse, LoginPostData>({
      query: body => ({
        url: 'login',
        method: 'POST',
        body
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        setUserData(data);
        dispatch(setUser(data));
      }
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST'
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        clearUserData();
        dispatch(clearUser());
      }
    }),

    refresh: build.query<any, void>({
      query: () => ({
        url: 'refresh',
        method: 'GET',
        headers: {
          refreshToken: getUserFromLocalStorage()?.refreshToken
        },
      }),
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        try {
          const refreshResult = await queryFulfilled;
          setUserData(refreshResult.data as UserState);
          dispatch(setUser(refreshResult.data as UserState));
        }
        catch (e) {
          console.error('refresh не удался', e);
          dispatch(clearUser());
          clearUserData()
        }
      }
    })
    
  })
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegistrationMutation,
  useRefreshQuery
} = authApi;