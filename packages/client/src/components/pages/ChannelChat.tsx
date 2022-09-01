import React from "react";
import { useParams } from "react-router-dom";
import { useChannelDetailsQuery } from "../../features/channels/channelsService";
import ChatSection from "../shared/ChatSection";
import LoadingSpinner from "../shared/LoadingSpinner";


/**
 * компонент страницы чата канала 
 */
const ChannelChat: React.FC = () => {

  const { channelId } = useParams();
  const {data: channelData, isLoading: isChannelDataLoding} = useChannelDetailsQuery(channelId || '');

  return (
    channelData?.chatRoomUuid && !isChannelDataLoding
    ? <ChatSection chatRoomUuid={channelData?.chatRoomUuid} />
    : <LoadingSpinner />
  )
}

export default ChannelChat;