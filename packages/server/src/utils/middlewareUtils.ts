import { NextFunction } from "express";
import { Socket, Server } from "socket.io";


// const Type = Server['']

const expressToSocketIoMiddlewareAdapter = (middleware: any) => 
  (socket: any, next: any) => 
    middleware(socket.request, {}, next);

export default expressToSocketIoMiddlewareAdapter;