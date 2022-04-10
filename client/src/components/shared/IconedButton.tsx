import React from 'react';
import { IconType } from 'react-icons';

export interface IconedButton {
  title?: string;
  icon: IconType;
  onClick?: () => void;
}

const IconedButton: React.FC<IconedButton> = ({ title, onClick, icon: Icon }) => {
  return (
    <button onClick={onClick} className='flex flex-col items-center justify-center w-24 h-24'>
      <Icon size={40} />
      <span>{title}</span>
    </button>
  )
}

export default IconedButton;