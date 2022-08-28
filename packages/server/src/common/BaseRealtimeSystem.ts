import { Server, Socket } from "socket.io";


/**
 * Базовый класс для систем, что получают внутренние события системы
 * и соответствующим образом оповещают клиентов через сокеты
 * (по сути - отправляют сообщения для комнат socket.io)
 */
export abstract class BaseRealtimeSystem {
  constructor(
    protected socketServer: Server
  ) {}

  public abstract init(): void;
}