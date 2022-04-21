import React from "react";
import { Outlet } from "react-router-dom";
import IconedRouteLink from "../shared/IconedRouteLink";
import { 
  IoPeopleOutline, IoPersonOutline, IoSettingsOutline, IoPersonCircleOutline
} from "react-icons/io5";



const MainLayout: React.FC = () => {
  
  return (
    <div className='
      h-screen w-screen bg-indigo-500 flex flex-col
      md:flex-row
    '>
      <div className='flex flex-col grow'>
        <div className='grow relative'>
          <div className="absolute overflow-y-auto top-4 bottom-4 left-4 right-4 overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
      <div className='
        rounded-t-lg basis-20 w-full bg-slate-300 flex flex-row justify-between px-4 text-sm bg-glassy
        md:flex-col md:order-first md:rounded-none md:px-0 md:justify-start
      '>
        <IconedRouteLink activeClass="bg-accented" url='/' icon={IoPersonCircleOutline} title='Главная' />
        <IconedRouteLink activeClass="bg-accented" url='groups' icon={IoPeopleOutline} title='Группы' />
        <IconedRouteLink activeClass="bg-accented" url='contacts' icon={IoPersonOutline} title='Контакты' />
        <IconedRouteLink activeClass="bg-accented" url='settings' icon={IoSettingsOutline} title='Настройки' />
      </div>
    </div>
  )
}

export default MainLayout;