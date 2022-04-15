import { controllerFunction as cf } from '../controller';
import authService from './authService';



const defaultCookieSettings = {
  // maxAge: 30 * 24 * 60 * 60 * 1000, //30 дней
  maxAge: 2 * 60 * 1000, // 2 минуты
  httpOnly: true
}

export default {

  register: cf(async (req, res) => {
    const {email, name, password} = req.body;
    const result = await authService.registration({email, name, password});
    res.json(result);
  }),

  login: cf(async (req, res) => {
    const {login, password} = req.body;
    const result = await authService.login(login, password);
    // res.cookie('refreshToken', result.refreshToken, defaultCookieSettings);

    res.json(result);
  }),

  logout: cf(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await authService.logout(refreshToken);
    res.json(result);
  }),

  refreshToken: cf(async (req, res) => {
    const refreshToken = req.headers.refreshtoken as string;
    const result = await authService.refresh(refreshToken! as string);
    res.cookie('refreshToken', result.refreshToken, defaultCookieSettings);
    res.json(result);
  }),

}