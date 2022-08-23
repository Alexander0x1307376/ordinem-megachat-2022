declare namespace Express {
  export interface Request {
    user: {
      uuid: string;
      name: string;
      avaPath?: string;
    };
  }
}
