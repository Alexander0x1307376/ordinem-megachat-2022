import React from "react";
import { IoEllipsisVertical, IoPersonCircleSharp } from "react-icons/io5";
import Ava from "./Ava";
import PopoverButton from "./PopoverButton";
import { PopoverMenuOptionsProps } from "./PopoverMenuOptions";


export interface UserItemProps {
  uuid: string;
  name: string;
  status: string;
  avaPath: string;
  options: PopoverMenuOptionsProps['options'];
  onBlockClick: () => void;
}

const UserItem: React.FC<UserItemProps> = ({
  name, status, avaPath, options, onBlockClick
}) => {
  return (
    <div className="p-2 flex bg-glassy 
        rounded-l-[50px] rounded-r relative
        hover:bg-glassydarken cursor-pointer
      "
      onClick={onBlockClick}
    >
      {avaPath 
        ? <Ava imageUrl={avaPath} />
        : <IoPersonCircleSharp className="h-10 w-10" />
      }
      
      <div className="grow ml-4 relative">
        <div className="flex flex-col absolute left-0 right-0 top-0 bottom-0">
          <span className="truncate">{name}</span>
          <span className="truncate text-sm text-textSecondary">{status}</span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PopoverButton
          menuOptions={options}
          icon={IoEllipsisVertical}
        />
      </div>
    </div>
  )
}

export default UserItem;