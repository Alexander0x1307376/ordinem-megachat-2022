import React from "react";
import { Outlet } from "react-router-dom";
import IconedRouteLink from "../shared/IconedRouteLink";
import { 
  IoChatboxEllipsesOutline, IoPeopleOutline, IoPersonOutline, IoSettingsOutline 
} from "react-icons/io5";
import MainLayout from "../pageLayouts/MainLayout";



const Main: React.FC = () => {
  
  return (
    <div className='
      h-screen w-screen bg-indigo-500 flex flex-col bg-fillmain text-textPrimary
      md:flex-row
    '>
      <div className='flex flex-col grow'>
        <div>
          <h1 className='grow-0 px-4 pt-2 text-2xl font-medium'>Заголовок</h1>
        </div>
        <div className='grow relative'>
          <div className="absolute overflow-y-auto top-4 bottom-4 left-4 right-4">
            <Outlet />
          </div>
        </div>
      </div>
      <div className='
        rounded-t-lg basis-20 w-full bg-slate-300 flex flex-row justify-between px-4 text-sm bg-glassy
        md:flex-col md:order-first md:rounded-none md:px-0 md:justify-start
      '>
        <IconedRouteLink url='chat' icon={IoChatboxEllipsesOutline} title='Чат' />
        <IconedRouteLink url='groups' icon={IoPeopleOutline} title='Группы' />
        <IconedRouteLink url='contacts' icon={IoPersonOutline} title='Контакты' />
        <IconedRouteLink url='settings' icon={IoSettingsOutline} title='Настройки' />
      </div>
    </div>
  )
}

export default Main;