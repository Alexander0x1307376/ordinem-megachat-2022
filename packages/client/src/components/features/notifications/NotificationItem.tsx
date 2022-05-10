import React from "react";
import { IoClose } from "react-icons/io5";

export interface NotificationItemProps {
  type?: 'notification' | 'friendRequest' | 'group' | 'user';
  title: string;
  content?: string;
  onClose?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title, content, onClose, type = 'notification'
}) => {

  return (
    <div className="group bg-bglighten rounded flex flex-col">
      <div className="px-4 pt-4 flex last:pb-4">
        <h2 className="grow font-semibold">{title}</h2>
        <button className="hidden group-hover:block" onClick={onClose}>
          <IoClose size={'1.5rem'} />
        </button>
      </div>
      {content && (
        <div className="p-4 text-textSecondary">
          {content}
        </div>
      )}
    </div>
  )
}

export default NotificationItem;