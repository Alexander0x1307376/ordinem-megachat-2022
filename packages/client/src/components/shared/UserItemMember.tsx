import React from "react";
import AvaOrLetter from "../features/icons/AvaOrLetter";

export interface UserItemMemberProps {
  uuid: string;
  name: string;
  avaPath?: string;
  status?: string;
  onClick?: () => void;
}

const UserItemMember: React.FC<UserItemMemberProps> = ({
  uuid, name, avaPath, status, onClick
}) => {
  return (
    <div className="p-1 flex 
        rounded-l-[50px] relative
        hover:bg-glassy cursor-pointer
      "
      onClick={onClick}
    >
      <AvaOrLetter imageUrl={avaPath} text={name} />
      <div className="grow ml-4 relative">
        <div className="flex flex-col absolute left-0 right-0 top-0 bottom-0 pr-4">
          <span className="truncate">{name}</span>
          <span className="truncate text-sm text-textSecondary">{status}</span>
        </div>
      </div>
    </div>
  )
}

export default UserItemMember;