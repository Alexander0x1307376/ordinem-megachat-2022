import React, { useEffect, useRef, useState } from "react";
import useWebsocketChatMessageEmitter from "../../features/chatMessageSystem/useWebsocketChatMessageEmitter";
import { useInView } from "react-intersection-observer";
import { selectMessagesOfRoom } from "../../features/chatMessageSystem/chatSystemSlice";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../store/utils/hooks";
import { encode } from "js-base64";
import { BASE_API_URL } from "../../config";
import ChatMessage from "../features/chat/ChatMessage";


export interface ChatSectionProps {
  chatRoomUuid: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatRoomUuid }) => {

  const messageEmitter = useWebsocketChatMessageEmitter();

  // #region выборка сообщений из хранилища
  const messages = useAppSelector((state: RootState) =>
    selectMessagesOfRoom(state.chatSystem, chatRoomUuid || '')
  );
  // #endregion

  // #region пагинация сообщений по курсору
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
    if (entryTop?.isIntersecting && messages?.length && chatRoomUuid) {
      const cursor = encode(JSON.stringify({
        value: messages?.[0].uuid,
        type: 'prev'
      }));
      messageEmitter.getMessages(chatRoomUuid, cursor);
    }
  }, [entryTop, chatRoomUuid, messages, messageEmitter]);

  // #endregion

  // #region Чат-комната сообщений - вход/выход
  useEffect(() => {
    messageEmitter.joinRoom(chatRoomUuid);
  }, [chatRoomUuid, messageEmitter]);

  useEffect(() => () => {
    messageEmitter.leaveAllRooms();
  }, [messageEmitter]);
  // #endregion 

  // #region отправка сообщений
  const [messageToSend, setMessageToSend] = useState<string>('');
  const handleSendMessage = (message: string) => {
    if (!chatRoomUuid) return;

    messageEmitter.sendMessage(chatRoomUuid, message);
    setMessageToSend('');
  }
  // #endregion

  return (
    <div className="h-full flex flex-col">
      <div ref={messageSection} className="overflow-y-auto flex flex-col-reverse grow">
        {messages?.length
          ? (
            <>
              <div ref={bottomObservable}></div>
              <div className="pt-4 space-y-2">
                {
                  messages?.map((message, index) =>
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

export default ChatSection;