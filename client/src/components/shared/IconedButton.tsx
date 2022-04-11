import React from 'react';
import { IconType } from 'react-icons';

export interface IconedButtonProps {
  title?: string;
  size?: string | number;
  icon: IconType;
  onClick?: () => void;
}

const IconedButton: React.FC<IconedButtonProps> = ({ title, onClick, icon: Icon, size = '2rem' }) => {
  return (
    <button onClick={onClick} className='flex flex-col items-center justify-center'>
      <Icon size={size} />
      {title && <span>{title}</span>}
    </button>
  )
}

export default IconedButton;