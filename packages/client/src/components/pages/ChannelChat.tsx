import React from "react";
import { useParams } from "react-router-dom";
import ChatSection from "../shared/ChatSection";



const ChannelChat: React.FC = () => {

  const {channelId} = useParams();
  
  return (
    <div>
      чат канала {channelId}
      {/* <ChatSection /> */}
    </div>
  )
}

export default ChannelChat;