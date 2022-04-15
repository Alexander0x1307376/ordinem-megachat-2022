import React from "react";
import { 
  IoExitOutline, IoNotificationsOffCircleOutline 
} from "react-icons/io5";
import ElementWithOptions from "./ElementWithOptions";

export interface GroupItemProps {
  name: string;
  link: string;
  description: string;
  imageUrl: string;
}


const GroupItem: React.FC<GroupItemProps> = ({ name, description, imageUrl, link}) => {

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