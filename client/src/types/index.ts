export interface LoginRequest {
  login: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userData: {
    uuid: string;
    name: string;
    avaUrl?: string;
  }
}

export interface User {
  uuid: string;
  name: string;
}