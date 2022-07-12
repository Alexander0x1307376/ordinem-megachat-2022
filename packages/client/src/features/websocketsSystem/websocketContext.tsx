import { createContext, ReactNode, useEffect, useState } from "react";
import { useStore } from "react-redux";
import io, {Socket} from "socket.io-client";
import { SERVER_URI } from "../../config";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../store/utils/hooks";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import { selectCurrentUser, selectCurrentUserTokens } from "../auth/authSlice";
import websocketChatMessageReceiver from "../chatMessageSystem/websocketChatMessageReceiver";
import websocketFriendshipReceiver from "../friendshipSystem/websocketFriendshipReceiver";
import realtimeSystemReceiver from "../realtimeSystem/realtimeSystemReceiver";
import websocketUsersDataReceiver from "../users/websocketUsersDataReceiver";

export interface IWebsocketContext {
  socket?: Socket;
}


const InitSocket = () => {

  console.log('Socket initialization...');

  const user = getUserFromLocalStorage();
  if (!user) {
    console.warn('Socket initialization: there is no user data in the local storage. Socket is not initialized.');
    return;
  }
  else {
    console.log('Socket initialization: user data', user);
  }
  
  const handshake = {
    ...user.userData,
    accessToken: user.accessToken
  };

  const socket = io(SERVER_URI, {
    withCredentials: true,
    query: handshake
  });

  return socket;
}
// const socket = InitSocket();

export const WebsocketContext = createContext<IWebsocketContext | undefined>(undefined);

const WebsocketProvider = ({children}: { children: ReactNode; }) => {
  const store = useStore<RootState>();
  const user = useAppSelector(selectCurrentUser);
  const tokens = useAppSelector(selectCurrentUserTokens);

  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {

    console.log('WebsocketProvider.useEffect');
    if(!socket && user.name && user.uuid) {
      
      const handshake = {
        ...user,
        accessToken: tokens.accessToken
      };
      console.log('WebsocketProvider: handshake,', handshake);
      const socketInstance = io(SERVER_URI, {
        withCredentials: true,
        query: handshake
      });
      setSocket(socketInstance);
      
      realtimeSystemReceiver(socketInstance, store);
      websocketFriendshipReceiver(socketInstance, store);
      websocketChatMessageReceiver(socketInstance, store);
      websocketUsersDataReceiver(socketInstance, store);
      
      console.log('WebsocketProvider: socket is Set')
    }

  }, [store, user, setSocket]);



  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>)
}


export default WebsocketProvider;