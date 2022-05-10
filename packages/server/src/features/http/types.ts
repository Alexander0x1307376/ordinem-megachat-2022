import { Query, Send } from 'express-serve-static-core';
import { Request } from 'express';


export interface TypedRequestBody<T> extends Request {
  body: T
}

export interface TypedRequestQuery<T extends Query> extends Request {
  query: T
}

export interface TypedRequest<
  Q extends Query = Query, 
  B = any
> extends Request {
  body: B,
  query: Q
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}