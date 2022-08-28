import { Server, Socket } from "socket.io";
import { ILogger } from "../logger/ILogger";
import UsersOnlineStore from "../features/usersOnlineStore/UsersOnlineStore";

/**
 * Базовый класс для обработчиков отдельных сокетов
 */
export abstract class BaseSocketHandler {
  protected socketId: string;

  constructor(
    protected socketServer: Server,
    protected socket: Socket,
    protected logger: ILogger,
    protected usersOnlineStore: UsersOnlineStore

  ) {
    this.socketId = socket.id;
    this.initHandlers = this.initHandlers.bind(this);
  }

  public abstract initHandlers(): void;
}