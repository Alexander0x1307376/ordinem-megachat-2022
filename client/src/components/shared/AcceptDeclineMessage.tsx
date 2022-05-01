import React from 'react';
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5';

export interface AcceptDeclineMessageProps {
  message: string;
  onAcceptClick?: () => void;
  onDeclineClick?: () => void;
}

const AcceptDeclineMessage: React.FC<AcceptDeclineMessageProps> = ({
  message, onAcceptClick, onDeclineClick
}) => {
  return (
    <div className="flex items-center">
      <div className="grow">
        <p>{message}</p>
      </div>
      <div className="flex space-x-1">
        <button onClick={onAcceptClick} className="px-4 py-1 hover:bg-info rounded">
          <IoCheckmarkSharp size={'1.4rem'} />
        </button>

        <button onClick={onDeclineClick} className="px-4 py-1 hover:bg-danger rounded">
          <IoCloseSharp size={'1.4rem'} />
        </button>
      </div>
    </div>
  )
}

export default AcceptDeclineMessage;