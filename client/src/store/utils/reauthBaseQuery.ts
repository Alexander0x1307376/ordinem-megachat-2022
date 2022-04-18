import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { setUser, clearUser, UserState } from '../authSlice';
import { clearUserData, getUserFromLocalStorage, setUserData } from '../../utils/authUtils';
import { BASE_API_URL } from '../../config/server';

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

// костыль, не позволяющий делать два запроса refresh один за другим
let allowRefresh = true;

// Пока что рефреши работают через заголовки
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // args - url, method и пр., api - getState, dispatch и пр.

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401 && allowRefresh) {

    // костыль в работе
    allowRefresh = false;
    setTimeout(() => { allowRefresh = true; }, 500);

    // получаем новый токен
    // const refreshResult = await baseQuery('/refresh', api, extraOptions);
    const refreshResult = await baseQuery({
      url: '/refresh',
      method: 'GET',
      headers: {
        refreshToken: getUserFromLocalStorage()?.refreshToken
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
  return result
}
