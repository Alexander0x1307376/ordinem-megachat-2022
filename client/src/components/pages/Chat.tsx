import React from "react";
import Ava from "../shared/Ava";
import { IoChevronBackOutline } from 'react-icons/io5';
import { Link } from "react-router-dom";


const messages = [
  {
    uuid: '001',
    avaUrl: 'https://i.pravatar.cc/150?img=5',
    userName: 'Васян',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '002',
    avaUrl: 'https://i.pravatar.cc/150?img=6',
    userName: 'Stasyan',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '003',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '004',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '005',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '006',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '007',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
  {
    uuid: '008',
    avaUrl: 'https://i.pravatar.cc/150?img=7',
    userName: 'Pussy Destroyer',
    date: '12-12-2022, 16:00',
    text: 'Превед! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, exercitationem.',
  },
]


const Chat: React.FC = () => {

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex items-center pb-4">
        <Link className="p-2" to='/contacts'><IoChevronBackOutline size="1.5rem" /></Link>
        <h1 className="text-2xl font-medium">Чат с User 1</h1>
      </div>
      <div className="grow relative">
        <div className="overflow-auto absolute top-0 bottom-0 w-full">

          {messages.map(({ uuid, avaUrl, userName, date, text }) => (

            <div key={uuid} className="w-full flex mb-4">
              <div className="grow-0">
                <Ava imageUrl={avaUrl} />
              </div>
              <div className="grow bg-bglighten ml-4 p-4 rounded-lg">
                {text}
              </div>
            </div>

          ))}


        </div>
      </div>
      <div className="grow-0">
        <input 
          className="w-full p-4 rounded-lg bg-glassy font-medium text-lg outline-none" 
          type="text" 
        />
      </div>
    </div>
  )
}

export default Chat;