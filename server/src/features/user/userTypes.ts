export interface User {
  uuid?: string,
  name: string,
  email: string,
  password: string,
}

export interface UserPostData {
  name: string;
  email: string;
  password: string;
}