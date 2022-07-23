import React, { useState } from "react";
import { useSendFriendRequestMutation } from "../../features/friendshipSystem/friendRequestsService";


export type RequestViewState = 'idle' | 'success' | 'error' | 'info';

export interface UserSearchPanelProps {
  onRequestSent?: () => void;
}

const AddFriendPanel: React.FC<UserSearchPanelProps> = ({
  onRequestSent
}) => {

  const placeholder = 'Введите ник пользователя';

  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [userNickname, setUserNickname] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [requestState, setRequestState] = useState<RequestViewState>('idle');

  const handleSendFriendRequest = async () => {
    try {
      const result = await sendFriendRequest(userNickname).unwrap();
      if (result.status === 'success') {
        setRequestState('success');
        setMessageText('Запрос дружбы отправлен');
        setUserNickname('');
      }
      else if(result.status === 'alreadyFriends') {
        setRequestState('info');
        setMessageText('Вы с данным пользователем уже друзья');
      }
      else if(result.status === 'counterRequest') {
        setRequestState('info');
        setMessageText('Был встречный запрос от этого пользователя. Дружба принята');
      }
      else if(result.status === 'noRequestedUser') {
        setRequestState('error');
        setMessageText('Пользователь не найден');
      }
      else if(result.status === 'toSelf') {
        setRequestState('error');
        setMessageText('Вы отправили запрос дружбы самому себе');
      }

    } catch (e) {
      setRequestState('error');
      setMessageText('Что-то пошло не так. Попробуйте ещё раз');
    }
  }

  const handleChange = (value: string) => {
    setUserNickname(value);
    if(requestState !== 'idle' || messageText) {
      setRequestState('idle');
      setMessageText('');
    }
  }

  const viewState: Record<RequestViewState, { 
    fieldClasses: string; 
    messageClasses: string;
  }> = {
    idle: {
      fieldClasses: "flex bg-bglighten rounded-lg border-2 border-bglighten mb-4 min-h-4",
      messageClasses: "text-textSecondary"
    },
    info: {
      fieldClasses: "flex bg-bglighten rounded-lg border-2 border-accented mb-4",
      messageClasses: "text-accent"
    },
    success: {
      fieldClasses: "flex bg-bglighten rounded-lg border-2 border-accented mb-4",
      messageClasses: "text-accent"
    },
    error: {
      fieldClasses: "flex bg-bglighten rounded-lg border-2 border-danger mb-4",
      messageClasses: "text-danger"
    }
  };


  return (
    <div className="flex flex-col h-full md:w-[46rem] overflow-hidden">
      <div className="flex flex-col w-full mt-4">
        <div className={viewState[requestState].fieldClasses}>
          <input
            placeholder={placeholder}
            value={userNickname}
            onChange={(e) => handleChange(e.target.value)}
            className="p-4 w-full bg-bglighten rounded-lg outline-none"
          />
          <button
            onClick={handleSendFriendRequest}
            className="p-2 m-2 rounded-md bg-infoDarken text-sm w-[20rem]"
          >
            Отправить запрос дружбы
          </button>
        </div>
        <span className={viewState[requestState].messageClasses}>
          {messageText}&nbsp;
        </span>
      </div>
    </div>
  )
} 

export default AddFriendPanel;