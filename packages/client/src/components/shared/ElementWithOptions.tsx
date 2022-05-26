import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import {PopoverMenuOptionsProps} from "./PopoverMenuOptions";
import { Link } from "react-router-dom";
import PopoverButton from "./PopoverButton";
import AvaOrLetter from "../features/icons/AvaOrLetter";


export interface ElementWithOptionsProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  options: PopoverMenuOptionsProps['options'];
  routeState?: any;
}


const ElementWithOptions: React.FC<ElementWithOptionsProps> = ({ 
  title, description, imageUrl, options, link, routeState
}) => {

  return (
    <div className="p-2 flex bg-glassy 
          rounded-l-[50px] rounded-r relative
          hover:bg-glassydarken cursor-pointer
        "> 
    <Link 
      className="grow flex"
      to={link}
      state={routeState}
    >
      <AvaOrLetter imageUrl={imageUrl} text={title} />

      <div className="grow ml-4 relative">
        <div className="flex flex-col absolute left-0 right-0 top-0 bottom-0">
          <span className="truncate">{title}</span>
          <span className="truncate text-sm text-textSecondary">{description}</span>
        </div>
      </div>
    </Link>

      <div className="flex items-center justify-center">
        <PopoverButton
          menuOptions={options}
          icon={IoEllipsisVertical}
        />
      </div>
    </div>
  )
}

export default ElementWithOptions;