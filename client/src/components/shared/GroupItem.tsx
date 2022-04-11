import React, { useState } from "react";
import Ava from "../shared/Ava";
import { 
  IoEllipsisVertical, IoExitOutline, IoNotificationsCircleOutline, IoNotificationsOffCircleOutline 
} from "react-icons/io5";
import IconedButton from "../shared/IconedButton";
import { Popover } from 'react-tiny-popover';
import PopoverMenuOptions from "./PopoverMenuOptions";

export interface GroupItemProps {
  name: string;
  description: string;
  imageUrl: string;
}


const GroupItem: React.FC<GroupItemProps> = ({name, description, imageUrl}) => {

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
    <div className="
      p-4 rounded-lg mb-2 bg-bglighten
      flex items-start
    ">
      <div className="mr-4">
        <Ava imageUrl={imageUrl} />
      </div>
      <div className="grow">
        <h2 className="text-lg font-semibold">{name}</h2>
        <h3 className="">{description}</h3>
      </div>
      <div>
        <Popover
          isOpen={isPopoverOpen}
          positions={['left', 'top', 'bottom', 'right']}
          content={<PopoverMenuOptions options={popoverMenuItems} />}
          align='start'
          onClickOutside={() => setIsPopoverOpen(false)}
        >
          <div>
            <IconedButton 
              onClick={() => setIsPopoverOpen(!isPopoverOpen)} 
              icon={IoEllipsisVertical} 
            />
          </div>
        </Popover>
      </div>
    </div>
  )
}

export default GroupItem;