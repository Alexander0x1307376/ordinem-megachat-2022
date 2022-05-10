export type AuthResponse = {
  userData: {
    uuid: string;
    name: string;
    avaUrl?: string;
  },
  accessToken: string;
  refreshToken: string;
}
export type LoginResponse = AuthResponse;
export type RegistrationResponse = AuthResponse;
export type RefreshResponse = AuthResponse;

export type LoginPostData = {
  login: string;
  password: string;
}

export type RegistrationPostData = {
  name: string;
  email: string;
  password: string;
} 