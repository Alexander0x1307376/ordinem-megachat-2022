import React from "react";


export interface HeaderProps {
  title: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, leftContent, rightContent }) => {
  return (
    <div className="flex items-center p-4">
      {leftContent}
      <h1 className="grow text-2xl font-medium">{title}</h1>
      {rightContent}
    </div>
  )
}

export default Header;