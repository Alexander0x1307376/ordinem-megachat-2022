import React from "react";
import Ava from "../features/icons/Ava";
import { IoChevronBackOutline } from 'react-icons/io5';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";


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


const ChatSection: React.FC = () => {

  const navigate = useNavigate();
  const location: any = useLocation();
  
  let previousPath = location.state?.previousPath || "/contacts";

  return (
    <div className="h-screen flex flex-col">
      <Header 
        title="Чат с User 1"
        leftContent={
          <Link className="p-2" to={previousPath}><IoChevronBackOutline size="1.5rem" /></Link>
        }
      />
      <div className="grow px-4 overflow-y-auto">
        <div className="">
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
      <div className="grow-0 px-4 pb-4">
        <input
          className="w-full p-4 rounded-lg bg-glassy font-medium text-lg outline-none"
          type="text"
        />
      </div>
    </div>
  )
}

export default ChatSection;