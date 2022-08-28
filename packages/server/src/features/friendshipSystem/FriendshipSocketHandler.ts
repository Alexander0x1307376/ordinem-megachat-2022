import { Server, Socket } from "socket.io";
import { BaseSocketHandler } from "../../common/BaseSocketHandler";
import { ILogger } from "../../logger/ILogger";
import UsersOnlineStore from "../usersOnlineStore/UsersOnlineStore";


/**
 * 
 */
export class FriendshipSocketHandler extends BaseSocketHandler {
  constructor(
    protected socketServer: Server,
    protected socket: Socket,
    protected logger: ILogger,
    protected usersOnlineStore: UsersOnlineStore,
  ) {
    super(socketServer, socket, logger, usersOnlineStore);
    
  }

  public override initHandlers() {

  }
}