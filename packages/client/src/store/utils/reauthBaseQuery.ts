import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { setUser, clearUser, UserState } from '../../features/auth/authSlice';
import { clearUserData, setUserData } from '../../utils/authUtils';
import { BASE_API_URL } from '../../config';
import { Mutex } from 'async-mutex';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
  credentials: 'same-origin'
});

const mutex = new Mutex();

// Пока что рефреши работают через заголовки
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // args - url, method и пр., api - getState, dispatch и пр.

  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {

    if(!mutex.isLocked()) {
      const release = await mutex.acquire();

      // получаем новый токен
      try {
        const refreshResult = await baseQuery({
          url: '/refresh',
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            refreshToken: (api.getState() as RootState).auth.refreshToken
          },
        }, api, extraOptions);

        if (refreshResult.data) {
          // сохраняем данные
          setUserData(refreshResult.data as UserState);
          api.dispatch(setUser(refreshResult.data as UserState));
          // повторяем изначальный запрос
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearUser());
          clearUserData()
        }
      }
      finally {
        release();
      }
    }
    else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result
}
