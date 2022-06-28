import { AuthResponse } from '@ordinem-megachat-2022/shared';
import axios from 'axios';
import { BASE_API_URL } from '../../config';
import { clearUserData, getUserFromLocalStorage, setUserData } from '../../utils/authUtils';

const http = axios.create({
  withCredentials: false,
  baseURL: BASE_API_URL,
  headers: {
    // "Access-Control-Allow-Origin": "*"
  }
});

http.interceptors.request.use((config) => {
  const userData = getUserFromLocalStorage();
  config.headers!.Authorization = `Bearer ${userData?.accessToken}`;
  return config;
})

http.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${BASE_API_URL}refresh`, {
          withCredentials: false,
          headers: {
            refreshToken: getUserFromLocalStorage()?.refreshToken || '',
          }
        });
        setUserData(response.data);
        return http.request(originalRequest);
      } catch (e) {
        console.error('Refresh не удался.');
        clearUserData();
      }
    }
    throw error;
  })

export default http;