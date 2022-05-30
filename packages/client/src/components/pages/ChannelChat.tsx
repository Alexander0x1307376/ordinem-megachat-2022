import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChatMessage from "../features/chat/ChatMessage";
import ChatSection from "../shared/ChatSection";


const messages = [
  {
    uuid: '001',
    avaUrl: 'https://i.pravatar.cc/150?img=5',
    userName: 'Васян',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '002',
    avaUrl: 'https://i.pravatar.cc/150?img=6',
    userName: 'Stasyan',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '003',
    avaUrl: '',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '004',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '005',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '006',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '007',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '008',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '009',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae odit ex alias vero! Enim repellat, voluptatibus sunt similique possimus dolores. Magnam nobis eaque vero nam saepe magni quidem, perspiciatis sequi, corporis dicta repellendus deleniti voluptas ducimus corrupti quas architecto illum?',
  },
  {
    uuid: '010',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    message: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
]

const ChannelChat: React.FC = () => {

  const {channelId} = useParams();

  const [messageToSend, setMessageToSend] = useState<string>('');
  const handleSendMessage = (message: string) => {
    console.log(messageToSend);
  }
  
  return (<div className="h-full flex flex-col">
    <div className="overflow-y-auto grow">
      <div className="pt-4 space-y-2">
        {
          messages.map((messageData) => (
            <ChatMessage key={messageData.uuid} {...messageData} />
          ))
        }
      </div>
    </div>
    <div className="grow-0 px-4 pb-4">
      <input
        value={messageToSend}
        onChange={(event) => setMessageToSend(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || messageToSend) 
            handleSendMessage(messageToSend)
        }}
        className="w-full p-4 rounded-lg bg-glassy font-thin text-lg outline-none"
        type="text"
      />
    </div>
  </div>)
}

export default ChannelChat;