import { createContext, ReactNode, useEffect } from "react";
import { useStore } from "react-redux";
import io, {Socket} from "socket.io-client";
import { SERVER_URI } from "../../config";
import { RootState } from "../../store/store";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import websocketChatMessageReceiver from "../chatMessageSystem/websocketChatMessageReceiver";
import websocketFriendshipReceiver from "../friendshipSystem/websocketFriendshipReceiver";
import realtimeSystemReceiver from "../realtimeSystem/realtimeSystemReceiver";
import websocketUsersDataReceiver from "../users/websocketUsersDataReceiver";

export interface IWebsocketContext {
  socket?: Socket;
}


const InitSocket = () => {
  const user = getUserFromLocalStorage();
  if (!user) 
    return;
  
  const handshake = {
    ...user.userData,
    accessToken: user.accessToken
  };

  const socket = io(SERVER_URI, {
    // withCredentials: true,
    query: handshake
  });

  return socket;
}
const socket = InitSocket();


export const WebsocketContext = createContext<IWebsocketContext | undefined>(undefined);

const WebsocketProvider = ({children}: { children: ReactNode; }) => {
  
  const store = useStore<RootState>();

  useEffect(() => {
    
    if (socket) {
      realtimeSystemReceiver(socket, store);
      websocketFriendshipReceiver(socket, store);
      websocketChatMessageReceiver(socket, store);
      websocketUsersDataReceiver(socket, store);
    }
    else {
      console.warn('there is no user data. socket is not initialized!');
    }
  }, [store]);



  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>)
}


export default WebsocketProvider;