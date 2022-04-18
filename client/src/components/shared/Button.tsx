import React from "react";


export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'default' | 'info' | 'warning' | 'accent' | 'danger' | 'brighten';
  htmlType?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'default', htmlType = 'button' }) => {

  const styleTypes = {
    default: 'bg-bglighten',
    info: 'bg-info',
    warning: 'bg-warning',
    accent: 'bg-accent',
    danger: 'bg-danger',
    brighten: 'bg-bglighten2'
  };
  const elementStyles = 'py-2 px-6 rounded-full min-w-[7rem] ' + styleTypes[type];

  return (
    <button 
      type={htmlType}
      className={elementStyles} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;