import { Server, Socket } from "socket.io";

export abstract class BaseRealtimeSystem {
  constructor(
    protected socketServer: Server
  ) {}

  public abstract init(): void;
}