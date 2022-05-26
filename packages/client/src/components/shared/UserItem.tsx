import React from "react";
import ElementWithOptions from "./ElementWithOptions";
import { PopoverMenuOptionsProps } from "./PopoverMenuOptions";


export interface UserItemProps {
  uuid: string;
  name: string;
  status: string;
  avaPath?: string;
  options: PopoverMenuOptionsProps['options'];
  link: string;
  routeState?: any;
}

const UserItem: React.FC<UserItemProps> = ({
  name, status, avaPath, options, link, routeState
}) => {
  return (
    <ElementWithOptions
      link={link}
      options={options}
      title={name}
      imageUrl={avaPath}
      description={status}
      routeState={routeState}
    />
  )
}

export default UserItem;