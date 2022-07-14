import React from "react";


export interface HeaderProps {
  title: string;
  afterTitleContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, leftContent, rightContent, afterTitleContent }) => {
  return (
    <div className="flex items-center p-4">
      {leftContent}
      <div className="flex grow items-center space-x-4">
        <h1 className=" text-2xl font-medium">{title}</h1>
        {afterTitleContent}
      </div>
      {rightContent}
    </div>
  )
}

export default Header;