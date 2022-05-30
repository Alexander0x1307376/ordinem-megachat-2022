import React, { Children, createContext, ReactNode, useRef } from "react";
import { useStore } from "react-redux";
import io, {Socket} from "socket.io-client";
import { SERVER_URI } from "../../config";
import { getUserFromLocalStorage } from "../../utils/authUtils";
import websocketFriendshipReceiver from "../friendshipSystem/websocketFriendshipReceiver";

export interface WebsocketContext {
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

export const WebsocketContext = createContext<WebsocketContext | undefined>(undefined);

const WebsocketProvider = ({children}: { children: ReactNode; }) => {

  const store = useStore();

  websocketFriendshipReceiver(socket!, store);

  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>)
}


export default WebsocketProvider;