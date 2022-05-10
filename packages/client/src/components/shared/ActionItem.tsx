import React from 'react';
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';

export interface ActionItemProps {
  message: string;
  buttonText?: string;
  buttonIcon: IconType;
  onActionClick?: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  message, buttonText, buttonIcon: ButtonIcon, onActionClick
}) => {
  return (
    <div className="flex items-center">
      <div className="grow">
        <p>{message}</p>
      </div>
      <div className="flex space-x-1">
        <button 
          className="relative group flex items-center px-4 py-1 
            hover:bg-glassydarken md:hover:rounded-l-none rounded 
          "
          onClick={onActionClick} 
        >
          <span 
            className='hidden md:group-hover:block absolute px-4 py-1
            right-full text-right bg-glassydarken rounded-l
            h-full whitespace-nowrap backdrop-blur
            '
          >{buttonText}</span>
          <ButtonIcon size={'1.4rem'} />
        </button>
      </div>
    </div>
  )
}

export default ActionItem;