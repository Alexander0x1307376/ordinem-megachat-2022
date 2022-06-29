import React from "react";
import AvaOrLetter from "../icons/AvaOrLetter";



export interface ChatMessageProps {
  avaUrl?: string;
  authorName: string;
  message: string;
  date: string;

}

const ChatMessage: React.FC<ChatMessageProps> = ({avaUrl, authorName, message, date}) => {

  return (
    <div className="w-full flex px-4 py-1 hover:bg-glassy">
      <div className="grow-0 pt-1">
        <div className="cursor-pointer">
          <AvaOrLetter text={authorName} imageUrl={avaUrl} />
        </div>
      </div>
      <div className="grow ml-2 px-4 rounded-lg flex flex-col">
        <div className="flex space-x-2 items-center">
          <h3 className="font-semibold cursor-pointer">{authorName}</h3>
          <span className="text-textSecondary text-sm cursor-default">{
            new Date(date).toLocaleString('ru')
          }</span>
        </div>
        <div>
          {message}
        </div>
      </div>
    </div> 
  )
}

export default ChatMessage;