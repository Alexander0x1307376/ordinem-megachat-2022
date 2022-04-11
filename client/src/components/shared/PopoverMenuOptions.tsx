import React from 'react';
import { IconType } from 'react-icons';

export interface PopoverMenuOptionsProps {
  options: {
    key: string;
    title: string;
    icon?: IconType;
    onClick?: () => void;
  }[]
}

const PopoverMenuOptions: React.FC<PopoverMenuOptionsProps> = ({ options }) => {
  return (
    <div className="
      p-4 rounded-lg bg-glassy text-textPrimary drop-shadow-sm
      flex flex-col
    ">
      {
        options.map(({key, title, icon: Icon, onClick}) => (
          <button 
            key={key} 
            onClick={onClick} 
            className="px-2 py-2 text-left flex items-center"
          >
            {Icon && <Icon size={'1.5rem'} />}
            <span className="ml-2">{title}</span>
          </button>
        ))
      }
    </div>
  )
}

export default PopoverMenuOptions;