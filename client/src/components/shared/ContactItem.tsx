import React, { useState } from "react";
import { 
  IoExitOutline, IoNotificationsOffCircleOutline 
} from "react-icons/io5";
import ElementWithOptions from "./ElementWithOptions";

export interface ContactItemProps {
  name: string;
  link: string;
  description: string;
  imageUrl: string;
}


const ContactItem: React.FC<ContactItemProps> = ({ name, description, imageUrl, link}) => {

  const popoverMenuItems = [
    {
      key: 'blockUser',
      title: 'Блокировать пользователя',
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
      title={name} 
      link={link}
      description={description} 
      imageUrl={imageUrl} 
      options={popoverMenuItems} 
    />
  )
}

export default ContactItem;