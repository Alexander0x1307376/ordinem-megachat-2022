import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_API_URL } from "../../config";
import { 
  selectMessagesOfChannel 
} from "../../features/chatMessageSystem/chatSystemSlice";
import useWebsocketChatMessageEmitter from "../../features/chatMessageSystem/useWebsocketChatMessageEmitter";
import { useAppSelector } from "../../store/utils/hooks";
import ChatMessage from "../features/chat/ChatMessage";
import { encode } from "js-base64";
import { RootState } from "../../store/store";
import { useInView } from "react-intersection-observer";

const ChannelChat: React.FC = () => {

  const { channelId } = useParams();
  const channelMessages = useAppSelector((state: RootState) => selectMessagesOfChannel(state.chatSystem, channelId || ''));
  const messageEmitter = useWebsocketChatMessageEmitter();

  const messageSection = useRef<HTMLDivElement>(null);

  const [topObservable, inViewTop, entryTop] = useInView({
    root: messageSection.current,
    rootMargin: "300px",
    threshold: 0
  });

  const [bottomObservable, inViewBottom, entryBottom] = useInView({
    root: messageSection.current,
    rootMargin: "300px",
    threshold: 0
  });

  useEffect(() => {
    if (entryTop?.isIntersecting && channelMessages?.length) {
      const cursor = encode(JSON.stringify({
        value: channelMessages?.[0].uuid,
        type: 'prev'
      }));
      messageEmitter.getMessages(channelId as string, cursor);
    }
  }, [entryTop])

  
  useEffect(() => {
    let currentMessageSection: Element | null = null;

    // websocket emits
    if(channelId) {
      console.log('ws emit for', channelId);
      messageEmitter.joinChannel(channelId);
    }
    return () => {
      // messageEmitter.leaveChannel(channelId!);
      if (currentMessageSection) 
        currentMessageSection = null;
    }
  }, [
    channelId, messageEmitter, messageSection
  ]);

  useEffect(() => () => {
    console.log('left channels');
  }, []);



  const [messageToSend, setMessageToSend] = useState<string>('');
  const handleSendMessage = (message: string) => {
    if (!channelId) return;

    messageEmitter.sendMessage(channelId, message);
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
            <div className="text-center p-4">
              в этом канале пока что нет сообщений
            </div>
          )
        }
        

      </div>
      <div className="grow-0 px-4 pb-4">
        <input
          value={messageToSend}
          onChange={(event) => setMessageToSend(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && messageToSend) 
              handleSendMessage(messageToSend)
          }}
          className="w-full p-4 rounded-lg bg-glassy font-thin text-lg outline-none"
          type="text"
        />
      </div>
    </div>
  )
}

export default ChannelChat;