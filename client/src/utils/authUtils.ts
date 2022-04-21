import jwtDecode from "jwt-decode";
// import { UserState } from "../store/authSlice";

// возвращает true если токен стух
export const checkTokenExpiration = (token: string) => {
  const currentDate = Math.floor(Date.now() / 1000);
  const refreshTokenExpiration = jwtDecode<any>(token).exp;
  return refreshTokenExpiration < currentDate;
} 


// возвращает юзера из хранилища
export const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : undefined;
}


// очистка данных пользователя в хранилище
export const clearUserData = () => {
  localStorage.removeItem('user');
}


// запись данных пользователя в хранилище
export const setUserData = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
}