export type User = {
  uuid: string;
  name: string;
  avaPath?: string;
}

export type UserPostData = {
  name: string;
  email: string;
  password: string;
  avaId?: number;
}