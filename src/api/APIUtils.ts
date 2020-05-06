import { navigate } from '@reach/router';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'userinfo';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 401:
        navigate('/register');
        break;
      case 404:
      case 403:
        navigate('/');
        break;
      default:
        navigate('/');
        break;
    }
    return Promise.reject(error.response);
  },
);
//将token放入请求头中
export function setToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common['X-BLACKCAT-TOKEN'] = `${token}`;
  } else {
    delete axios.defaults.headers.common['X-BLACKCAT-TOKEN'];
  }
}

type JWTPayload = {
  id: string;
  username: string;
  exp: number;
};
//当前token通过前端验证是否在有效期内
export function isTokenValid(token: string) {
  try {
    const decodedJwt: JWTPayload = jwtDecode(token);
    const currentTime = Date.now().valueOf() / 1000;
    return decodedJwt.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export default axios;
