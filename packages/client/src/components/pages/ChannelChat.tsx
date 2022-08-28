import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_API_URL } from "../../config";
import { 
  selectMessagesOfRoom 
} from "../../features/chatMessageSystem/chatSystemSlice";
import useWebsocketChatMessageEmitter from "../../features/chatMessageSystem/useWebsocketChatMessageEmitter";
import { useAppSelector } from "../../store/utils/hooks";
import ChatMessage from "../features/chat/ChatMessage";
import { encode } from "js-base64";
import { RootState } from "../../store/store";
import { useInView } from "react-intersection-observer";
import { useChannelDetailsQuery } from "../../features/channels/channelsService";



const ChannelChat: React.FC = () => {

  const { channelId } = useParams();

  const {data: channelData, isLoading: isChannelLoading} = useChannelDetailsQuery(channelId || '');

  const channelMessages = useAppSelector((state: RootState) => 
    selectMessagesOfRoom(state.chatSystem, channelData?.chatRoomUuid || '')
  );

  const messageEmitter = useWebsocketChatMessageEmitter();

  
  // #region подгрузка сообщений
  const messageSection = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topObservable, inViewTop, entryTop] = useInView({
    root: messageSection.current,
    rootMargin: "300px",
    threshold: 0
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bottomObservable, inViewBottom, entryBottom] = useInView({
    root: messageSection.current,
    rootMargin: "300px",
    threshold: 0
  });

  useEffect(() => {
    if (entryTop?.isIntersecting && channelMessages?.length && !isChannelLoading && channelData?.chatRoomUuid) {
      const cursor = encode(JSON.stringify({
        value: channelMessages?.[0].uuid,
        type: 'prev'
      }));
      messageEmitter.getMessages(channelData.chatRoomUuid, cursor);
    }
  }, [entryTop, channelData, channelMessages, isChannelLoading, messageEmitter]);

  // #endregion


  useEffect(() => {
    if (channelId === channelData?.uuid && channelData && !isChannelLoading) {
      console.log('вход в канал: ', channelData.name);
      messageEmitter.joinRoom(channelData.chatRoomUuid);
    }
  }, [channelId, channelData, isChannelLoading, messageEmitter]);

  useEffect(() => () => {
    messageEmitter.leaveAllRooms();
  }, [messageEmitter]);


  const [messageToSend, setMessageToSend] = useState<string>('');
  const handleSendMessage = (message: string) => {
    if (!channelData?.chatRoomUuid) return;

    messageEmitter.sendMessage(channelData.chatRoomUuid, message);
    setMessageToSend('');
  }
  
  return (
    <div className="h-full flex flex-col">
      <div ref={messageSection} className="overflow-y-auto flex flex-col-reverse grow">  
        {channelMessages?.length
          ? (
            <>
              <div ref={bottomObservable}></div>
              <div className="pt-4 space-y-2">
                {
                  channelMessages?.map((message, index) =>
                    <ChatMessage key={message.uuid}
                      avaUrl={message.authorAvaPath ? BASE_API_URL + message.authorAvaPath : undefined}
                      authorName={message.authorName}
                      message={message.text}
                      date={message.createdAt}
                    />
                  )
                }
              </div>
              <div ref={topObservable}></div>
            </>
          )
          : (
            <div className="text-center p-4 mb-4">
              в этом канале пока что нет сообщений
            </div>
          )
        }
        

      </div>
      <div className="grow-0 px-4 pb-4 flex">
        <input
          value={messageToSend}
          onChange={(event) => setMessageToSend(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && messageToSend) 
              handleSendMessage(messageToSend)
          }}
          className="w-full p-4 rounded-l-lg bg-glassy font-thin text-lg outline-none"
          type="text"
        />
        <div className="bg-glassy rounded-r-lg flex pr-4">
          {/* здесь будут кнопы */}
        </div>
      </div>
    </div>
  )
}

export default ChannelChat;