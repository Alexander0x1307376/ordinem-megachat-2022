import React, { useState } from "react";
import Ava from "../shared/Ava";
import { 
  IoEllipsisVertical, IoExitOutline, IoNotificationsCircleOutline, IoNotificationsOffCircleOutline 
} from "react-icons/io5";
import IconedButton from "../shared/IconedButton";
import { Popover } from 'react-tiny-popover';
import PopoverMenuOptions from "./PopoverMenuOptions";
import ElementWithOptions from "./ElementWithOptions";

export interface GroupItemProps {
  name: string;
  link: string;
  description: string;
  imageUrl: string;
}


const GroupItem: React.FC<GroupItemProps> = ({ name, description, imageUrl, link}) => {

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const popoverMenuItems = [
    {
      key: 'leaveGroup',
      title: 'Выйти из группы',
      icon: IoExitOutline
    },
    {
      key: 'notifications',
      title: 'Выключить уведомления',
      icon: IoNotificationsOffCircleOutline
    }
  ];

  return (
    <ElementWithOptions 
      link={link}
      title={name} 
      description={description} 
      imageUrl={imageUrl} 
      options={popoverMenuItems} 
    />
  )
}

export default GroupItem;